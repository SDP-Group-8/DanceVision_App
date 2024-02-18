from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import os
from pathlib import Path
import uvicorn
import logging

from fastapi import FastAPI, File, UploadFile, status
from fastapi.responses import JSONResponse

import asyncio
import argparse

from dancevision_server.session_description import SessionDescription

rest_app = FastAPI()

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
    file_data = video.file.read()
    file_size = len(file_data)
    
    if video.content_type not in ('video/mp4', 'video/x-msvideo'):
        return {"message": "Invalid file format"}
    if file_size > (300 * pow(1024, 2)):  # 300 MB
        return {"message": "File size too large"}

    destination_path = os.path.join("uploads", video.filename)
    os.makedirs(os.path.dirname(destination_path), exist_ok=True)

    with open(destination_path, "wb") as f:
        f.write(file_data)

    # generate thumbnail
    img_output_path = os.path.join("uploads", "thumbnails", video.filename[0:-4], ".jpg")
    subprocess.call(['ffmpeg', '-i', destination_path, '-ss', '00:00:00.000', '-vframes', '1', img_output_path])

    return {"message": "File uploaded successfully"} 

# Retrieve thumbnail icons.
@rest_app.get("/thumbnails")
async def get_thumbnails():
    """
    Get thumbnails from the filesystem
    :return: A list of all thumbnail names
    """
    thumbnail_dir = Path(os.path.join("uploads", "thumbnails"))
    thumbnails = [os.path.join(f"{thumbnail_file.name}") for thumbnail_file in thumbnail_dir.iterdir() if thumbnail_file.is_file()]
    return {"thumbnails": thumbnails}

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
    parser = argparse.ArgumentParser()

    parser.add_argument("--address", dest="address")
    args = parser.parse_args()

    uvicorn.run(rest_app, host=args.address)