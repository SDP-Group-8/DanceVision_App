from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn
import logging
import asyncio
from pathlib import Path

from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, File, UploadFile, status
from fastapi.responses import JSONResponse, FileResponse

import argparse
import logging

from pose_estimation.scoring.euclidean_score import EuclideanScore

from dancevision_server.session_description import SessionDescription
from dancevision_server.video_saver import VideoSaver
from dancevision_server.stream_comparison import StreamComparison
from dancevision_server.environment import model_var_name
from dancevision_server.thumbnail_info import ThumbnailInfo
from dancevision_server.stream_sender import StreamSender
from dancevision_server.host_identifiers import SERVER_IDENTIFIER, RASPBERRY_PI_IDENTIFIER
from dancevision_server.video_loader import VideoLoader
from dancevision_server.recorder import Recorder
from dancevision_server.score_estimator import ScoreEstimator
from dancevision_server.score_channel import ScoreChannel
from dancevision_server.score_aggregator import ScoreAggregator

from dancevision_startup.launch_video_streamer import launch_video_streamer
from dancevision_server import mongoServer

rest_app = FastAPI()
logger = logging.getLogger("dancevision_server.rest_server")

address = None
port = None

file = None

comparison = None
score_aggregator = None

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
    video_saver.validate()
    

    video_saver.save_video()
    video_saver.generate_thumbnail()
    video_saver.save_keypoints()

    return {"message": "File uploaded successfully"} 

@rest_app.get("/start-video")
async def start_video(video_name: str, basename: str):
    global address
    global port
    global file
    global comparison
    global score_aggregator
    global no_ros
    global stream_address
    global stream_port
    
    """
    Start the main comparison screen with the selected video
    :param video_name: name of the video file
    """
    filepath = VideoSaver.get_video_filepath(video_name)

    video_loader = VideoLoader(Path(video_name))
    keypoints = video_loader.load_keypoints()
    if keypoints:
        score_estimator = ScoreEstimator(keypoints, EuclideanScore())

    def read_lines(stdin, stdout, stderr):
        stdout.readlines()

    if stream_address is not None:
        launch_video_streamer(stream_address, stream_port, read_lines)

    if not no_ros:
        robot_controller.set_velocity(0.01)

    model_path = os.environ[model_var_name]

    score_aggregator = ScoreAggregator()

    def callback(score_channel: ScoreChannel, pose_detections):
        if score_estimator and score_channel:
            score, component_scores = score_estimator.find_score(0, pose_detections)
            score_channel.send_score_message(score)
            score_aggregator.add_scores(component_scores)

        #callback = None if no_ros else lambda: robot_controller.set_velocity(0.1)
        pass

    while SERVER_IDENTIFIER not in connection_offers:
        await asyncio.sleep(2)

    offer = connection_offers[SERVER_IDENTIFIER]

    recorder = Recorder()
    recorder.initialize(basename)

    args = {
        "parameter_path": model_path,
        "recorder": recorder,
        "on_pose_detections": callback
    }

    comparison = None # No clue why this is needed

    if file is not None:
        def on_connection_closed():            
            del connection_offers[SERVER_IDENTIFIER]
            del connection_answers[SERVER_IDENTIFIER]

        args["file"] = file
        comparison = StreamSender(on_connection_closed=on_connection_closed, **args)

        answer = await comparison.run(offer)
        comparison.add_second_track(file=str(filepath))
        connection_answers[SERVER_IDENTIFIER] = answer
    else:
        args["file"] = str(filepath)
        comparison = StreamComparison(address, port, **args)
        answer = await comparison.negotiate_sender(offer)
        connection_answers[SERVER_IDENTIFIER] = answer

        async def set_offer_and_get_answer(local_offer):
            connection_offers[RASPBERRY_PI_IDENTIFIER] = local_offer
            while RASPBERRY_PI_IDENTIFIER not in connection_answers:
                await asyncio.sleep(2)
            return connection_answers[RASPBERRY_PI_IDENTIFIER]

        await comparison.negotiate_receiver(set_offer_and_get_answer)

    return JSONResponse({"datetime": recorder.get_recording_datetime().isoformat()})

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
    global score_aggregator

    results = score_aggregator.get_all_scores()
    results["avg_score_over_time"] = []

    return results

@rest_app.get("/user_video")
async def get_user_video(video_name: str, attempt_datetime: str):
    """
    
    """
    #FileResponse(path, media_type="video/mp4" )
    return {"name": video_name}

@rest_app.post("/db_detailed_score")
async def db_detailed_score_endpoint(request : Request):
    data = await request.json()
    print(data)
    username = data.get("username")
    id = data.get("id")
    return mongoServer.get_dance_score(username, id)

@rest_app.post("/login")
async def login_endpoint(request : Request):
    data = await request.json()
    print(data)
    email = data.get("email")
    password = data.get("password")
    return mongoServer.login(email, password)

@rest_app.post("/register")
async def register_endpoint(request : Request):
    data = await request.json()
    print(data)
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    userName = data.get("username")
    if mongoServer.email_exists(email):
        return {'status': 'failure', 'reason': 'Email already in use'}
    elif mongoServer.user_name_exists(userName):
        return { 'status': 'failure', 'reason': 'Username already exists' }
    else:
        result, login_id = mongoServer.register(email, password)
        mongoServer.add_personal_information(userName, login_id, name, email )
        return result

@rest_app.post("/personal_details")
async def personal_details_endpoint(request : Request):
    data = await request.json()
    result = mongoServer.get_personal_information(data.get("username"))
    return  result
    
    

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

def run_app(app_address, app_port, app_no_ros=True, app_stream_address=None, app_stream_port=None, app_file=None):
    global address
    global port
    global robot_controller
    global no_ros
    global stream_address
    global stream_port
    global file

    address = app_address
    port = app_port
    no_ros = app_no_ros
    stream_address = app_stream_address
    stream_port = app_stream_port
    file = app_file

    if not no_ros:
        from robot_controller.robot_controller_node import RobotControllerNode
        robot_controller = RobotControllerNode()

    thumbnails_dir = VideoSaver.get_video_directory()
    rest_app.mount("/thumbnails", StaticFiles(directory=thumbnails_dir / "thumbnails"))
    uvicorn.run(rest_app, host=app_address, port=int(app_port))

def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("--address", dest="address")
    parser.add_argument("--port", dest="port")
    parser.add_argument("--no-ros", dest="no_ros", action="store_true")
    parser.add_argument("--stream-address", dest="stream_address")
    parser.add_argument("--stream-port", dest="stream_port")
    parser.add_argument("--file", dest="file")
    args = parser.parse_args()

    run_app(args.address, args.port, args.no_ros, args.stream_address, args.stream_port, args.file)
