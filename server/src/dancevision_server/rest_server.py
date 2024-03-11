from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn
import logging
import asyncio
from pathlib import Path

from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, File, UploadFile, status
from fastapi.responses import JSONResponse

import argparse

from dancevision_server.session_description import SessionDescription
from dancevision_server.video_saver import VideoSaver
from dancevision_server.stream_comparison import StreamComparison
from dancevision_server.environment import model_var_name, script_location_name
from dancevision_server.thumbnail_info import ThumbnailInfo
from dancevision_server.stream_sender import StreamSender
from dancevision_server.host_identifiers import SERVER_IDENTIFIER, RASPBERRY_PI_IDENTIFIER
from dancevision_server.video_loader import VideoLoader

from dancevision_startup.launch_video_streamer import launch_video_streamer

rest_app = FastAPI()

address = None
port = None
debug = False

only_send = False
file = None

comparison = None

no_ros = False
robot_controller = None

stream_address = None
stream_port = None

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
    global comparison
    global stream_address
    global stream_port
    
    """
    Start the main comparison screen with the selected video
    :param video_name: name of the video file
    """
    filepath = VideoSaver.get_video_filepath(video_name)

    video_loader = VideoLoader(Path(video_name))
    keypoints = video_loader.load_keypoints()

    if stream_address is not None:
        launch_video_streamer(Path(os.environ[script_location_name]), stream_address, stream_port)

    model_path = os.environ[model_var_name]
    args = {"file": str(filepath)}

    while SERVER_IDENTIFIER not in connection_offers:
        await asyncio.sleep(2)

    offer = connection_offers[SERVER_IDENTIFIER]

    if only_send:
        sender = StreamSender(**args)

        answer = await sender.run(offer)
        sender.add_second_track(file=file)
        connection_answers[SERVER_IDENTIFIER] = answer
    else:
        callback = None if no_ros else lambda: robot_controller.set_velocity(0.1)

        comparison = StreamComparison(address, port, parameter_path = model_path, on_pose_detections=callback, **args)
        answer = await comparison.negotiate_sender(offer)
        connection_answers[SERVER_IDENTIFIER] = answer

        async def set_offer_and_get_answer(local_offer):
            connection_offers[RASPBERRY_PI_IDENTIFIER] = local_offer
            while RASPBERRY_PI_IDENTIFIER not in connection_answers:
                await asyncio.sleep(2)
            return connection_answers[RASPBERRY_PI_IDENTIFIER]

        await comparison.negotiate_receiver(set_offer_and_get_answer)

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

@rest_app.get("/detailed_scores")
async def get_detailed_scores():
    """
    Return detailed scores and information about frames compared so far
    :return A list of scores for each Keypoint statistics
    """
    return {
            "r_shoulder_l_shoulder_l_elbow": [10,20,30,40,50,60],
            "l_shoulder_l_elbow_l_wrist": [20,15,40,28,60],
            "l_shoulder_r_shoulder_r_elbow": [9,56,20,45,60],
            "r_shoulder_r_elbow_r_wrist": [10,30,40,50,70],
            "r_hip_l_hip_l_knee": [20,30,40,50,60],
            "l_hip_l_knee_l_ankle": [20,30,40,50,60],
            "l_hip_r_hip_r_knee": [20,30,40,50,60],
            "r_hip_r_knee_r_ankle": [20,30,40,50,60]
        }

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

@rest_app.get("/connection-close")
async def connection_close(host_id: str):
    """
    Clears the connection negotation between parties
    :param host_id: Host identifier for peer connection
    :return: Successful response
    """
    global connection_offers
    global connection_answers
    del connection_offers[host_id]
    del connection_answers[host_id]
    return JSONResponse({"message": "Successfully cleared cache"})

def main():
    global address
    global port
    global debug

    global only_send
    global file

    global robot_controller
    global no_ros

    global stream_address
    global stream_port

    parser = argparse.ArgumentParser()

    parser.add_argument("--address", dest="address")
    parser.add_argument("--port", dest="port")
    parser.add_argument("--debug", dest="debug", action="store_true")
    parser.add_argument("--only-send", dest="only_send", action="store_true")
    parser.add_argument("--file", dest="file")
    parser.add_argument("--no-ros", dest="no_ros", action="store_true")
    parser.add_argument("--stream-address", dest="stream_address")
    parser.add_argument("--stream-port", dest="stream_port")
    args = parser.parse_args()

    address = args.address
    port = args.port
    debug = args.debug
    no_ros = args.no_ros

    stream_address = args.stream_address
    stream_port = args.stream_port

    if not no_ros:
        from robot_controller.robot_controller_node import RobotControllerNode
        robot_controller = RobotControllerNode()

    if (args.only_send == True) != (args.file is not None):
        raise ValueError("You must set both the --only-send and --file options")

    only_send = args.only_send
    file = args.file

    thumbnails_dir = VideoSaver.get_video_directory()
    rest_app.mount("/thumbnails", StaticFiles(directory=thumbnails_dir / "thumbnails"))
    print("got here")
    uvicorn.run(rest_app, host=args.address, port=int(args.port))
