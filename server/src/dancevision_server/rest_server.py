from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn
import logging
import asyncio

from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, File, UploadFile, status
from fastapi.responses import JSONResponse

import argparse

from dancevision_server.session_description import SessionDescription
from dancevision_server.video_saver import VideoSaver
from dancevision_server.stream_comparison import StreamComparison
from dancevision_server.environment import model_var_name
from dancevision_server.thumbnail_info import ThumbnailInfo
from dancevision_server.stream_sender import StreamSender
from dancevision_server.host_identifiers import SERVER_IDENTIFIER

rest_app = FastAPI()

address = None
port = None
debug = False

only_send = False
file = None

comparison = None
connection_offers = {}
connection_answers = {}

logger = logging.Logger("rest_server")

rest_app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],  
        allow_headers=["*","Content-Type", "Content-Length", "Content-Range"]
    )

# Handle HTTP post request to upload video.
@rest_app.post("/upload-video")
async def upload_video(video: UploadFile = File(...)):
    """
    Upload video to the filesystem
    :param video: The video sent in a post request
    :return: Successfull response or error message
    """
    video_saver = VideoSaver(video)
    valid = video_saver.validate()
    if valid is not None:
        return valid

    video_saver.save_video()
    video_saver.generate_thumbnail()
    video_saver.save_keypoints()

    return {"message": "File uploaded successfully"} 

@rest_app.get("/start-video")
async def start_video(video_name: str):
    global address
    global port
    global only_send
    global file
    
    """
    Start the main comparison screen with the selected video
    :param video_name: name of the video file
    """
    filepath = VideoSaver.get_video_filepath(video_name)

    model_path = os.environ[model_var_name]
    args = {"file": str(filepath)}

    if only_send:
        sender = StreamSender(**args)

        while SERVER_IDENTIFIER not in connection_offers:
            await asyncio.sleep(2)

        answer = await sender.run(connection_offers[SERVER_IDENTIFIER])
        sender.add_second_track(file=file)
        connection_answers[SERVER_IDENTIFIER] = answer
    else:
        args.update({"address": address, "port": port})
        comparison = StreamComparison(parameter_path = model_path, **args)
        comparison.run()

    return JSONResponse({"message": "Successfully created streaming client"})

# Retrieve thumbnail icons.
@rest_app.get("/thumbnails")
async def get_thumbnails():
    """
    Get thumbnails from the filesystem
    :return: A list of all thumbnail names
    """
    videos_dir = VideoSaver.get_video_directory()
    names = (ThumbnailInfo(video_file) for video_file in videos_dir.iterdir() if video_file.is_file())
    return {"thumbnails": [thumbnail.to_dict() for thumbnail in names]}

@rest_app.post("/offer")
async def get_offer(offer: SessionDescription):
    """
    Submits an offer to the server
    :param offer: the submitted peer connection offer
    """
    global connection_offers
    connection_offers[offer.host_id] = offer
    return JSONResponse({"message": "Successfully set offer"})

@rest_app.get("/request-offer")
async def request_offer(host_id: str):
    """
    Gets the latest offer submitted with the identifier
    :param host_id: Host identifier for peer connection
    :return: The latest offer submitted to the server
    """
    global connection_offers
    if host_id in connection_offers:
        return JSONResponse(
            {
                "sdp": connection_offers[host_id].sdp,
                "type": connection_offers[host_id].type
            }
        )
    else:
        return JSONResponse("", status_code=status.HTTP_409_CONFLICT)

@rest_app.post("/answer")
async def get_answer(answer: SessionDescription):
    """
    Submits an answer to the server
    :param answer: the submitted peer connection answer
    """
    global connection_answers
    connection_answers[answer.host_id] = answer
    return JSONResponse({"message": "Successfully set answer"})

@rest_app.get("/request-answer")
async def request_answer(host_id: str):
    """
    Gets the latest answer submitted with the identifier
    :param host_id: Host identifier for peer connection
    :return: The latest answer submitted to the server
    """
    global connection_offers
    if host_id in connection_answers:
        return JSONResponse(
            {
                "sdp": connection_answers[host_id].sdp,
                "type": connection_answers[host_id].type
            }
        )
    else:
        return JSONResponse("", status_code=status.HTTP_409_CONFLICT)


def main():
    global address
    global port
    global debug

    global only_send
    global file

    parser = argparse.ArgumentParser()

    parser.add_argument("--address", dest="address")
    parser.add_argument("--port", dest="port")
    parser.add_argument("--debug", dest="debug", action="store_true")
    parser.add_argument("--only-send", dest="only_send", action="store_true")
    parser.add_argument("--file", dest="file")
    args = parser.parse_args()

    address = args.address
    port = args.port
    debug = args.debug

    if (args.only_send == True) != (args.file is not None):
        raise ValueError("You must set both the --only-send and --file options")

    only_send = args.only_send
    file = args.file

    thumbnails_dir = VideoSaver.get_video_directory()
    rest_app.mount("/thumbnails", StaticFiles(directory=thumbnails_dir / "thumbnails"))
    uvicorn.run(rest_app, host=args.address, port=int(args.port))
