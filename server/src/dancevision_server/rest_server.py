from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

from contextlib import asynccontextmanager
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, File, UploadFile, status
from fastapi.responses import JSONResponse, FileResponse

import argparse
import logging
import multiprocessing

from dancevision_startup.launch_video_streamer import launch_video_streamer, launch_chromium

from dancevision_server.mux.local_mux import LocalMux
from dancevision_server.mux.stream_mux import StreamMux
from dancevision_server.session_description import SessionDescription
from dancevision_server.video_saver import VideoSaver
from dancevision_server.thumbnail_info import ThumbnailInfo
from dancevision_server.video_starter import VideoStarter
from dancevision_server.dual_video_starter import DualVideoStarter
from dancevision_server.keypoint_responders.keypoint_feedback import KeypointFeedback
from dancevision_server.keypoint_responders.keypoint_naive import KeypointNaive
from dancevision_server.score_aggregator import ScoreAggregator
from dancevision_server.recorder import Recorder

from dancevision_server import mongoServer

@asynccontextmanager
async def lifespan(app: FastAPI):
    multiprocessing.set_start_method("spawn", force=True)
    yield

rest_app = FastAPI(debug=True, lifespan=lifespan)
logger = logging.getLogger("dancevision_server.rest_server")

address = None
port = None

file = None

video_starter = None
score_aggregator = None
planner = None

no_ros = False
robot_controller = None

stream_address = None
stream_port = None

connection_offers = {}
connection_answers = {}

current_video_id = ''

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
async def start_video():
    global stream_address
    global stream_port

    global file
    global video_starter
    global planner
    global no_ros
    
    """
    Start the main comparison screen with the selected video
    :param video_name: name of the video file
    """
    mux = StreamMux() if file is None else LocalMux()
    keypoint_feedback = KeypointNaive() if no_ros else KeypointFeedback(planner)
    video_starter = VideoStarter(stream_address, stream_port, mux, keypoint_feedback, file, connection_offers, connection_answers)
    await video_starter.start()
    return {"message": "Live Video Started"} 

@rest_app.get("/open-window")
def open_window():
    global stream_address
    global stream_port
    
    if stream_address is not None:
        launch_chromium(stream_address, stream_port, True)

@rest_app.get("/start-streamer")
def start_streamer():
    global stream_address
    global stream_port

    if stream_address is not None:
        launch_video_streamer(stream_address, stream_port)

@rest_app.get("/start-reference")
async def start_reference(video_name: str, user_id: str):
    global stream_address
    global stream_port
    global video_starter
    global score_aggregator

    score_aggregator = ScoreAggregator()

    mux = StreamMux() if file is None else LocalMux()
    video_starter = DualVideoStarter(stream_address, stream_port, mux, file, connection_offers, connection_answers)

    recording_time = await video_starter.start(video_name, score_aggregator, user_id)
    return JSONResponse({"datetime": recording_time.isoformat()})

@rest_app.delete("/clear-connection")
async def clear_connection():
    global video_starter

    if video_starter is not None:
        await video_starter.close()

    return {"message": "Success"}

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
async def get_detailed_scores(username: str, dance_name: str, datetime: str):
    """
    Return detailed scores and information about frames compared so far
    :return A list of scores for each Keypoint statistics
    """
    global score_aggregator
    global current_video_id

    detailed_scores = score_aggregator.get_all_scores()
    avgScores = score_aggregator.get_avg_scores()
    accuracy_over_time = score_aggregator.calculate_accuracy_over_time()
    total_score = score_aggregator.get_total_score()
    detailed_scores["avg_score_over_time"] = accuracy_over_time
    avgScores['total_score'] = total_score

    results = {
        'avgScores': avgScores,
        'detailed_scores' : detailed_scores,
        "ref_video_name" : dance_name,
        "time_stamp" : datetime
    }

    video_id = mongoServer.store_dance_score(username, results)
    current_video_id = video_id

    return {"id": current_video_id}

@rest_app.get("/user_video")
async def get_user_video(user_id: str, attempt_datetime: str):
    """
    
    """
    path = Recorder.get_user_recording_filepath(user_id, attempt_datetime)
    return FileResponse(path, media_type="video/mp4" )

@rest_app.post("/db_detailed_score")
async def db_detailed_score_endpoint(request : Request):
    data = await request.json()
    username = data.get("username")
    id = data.get("id")
    return mongoServer.get_dance_score(username, id)

@rest_app.post("/login")
async def login_endpoint(request : Request):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")
    return mongoServer.login(email, password)

@rest_app.post("/register")
async def register_endpoint(request : Request):
    data = await request.json()
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

@rest_app.get("/userAllDanceScores")
async def user_all_dance_score_endpoint(username: str):
    result = mongoServer.get_all_dance_score(username)
    return result

    
    

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
    global planner

    address = app_address
    port = app_port
    no_ros = app_no_ros
    stream_address = app_stream_address
    stream_port = app_stream_port
    file = app_file

    if not no_ros:
        from robot_controller.robot_controller_node import RobotControllerNode
        from dancevision_server.planners.fixed_planner import FixedPlanner as Planner
        robot_controller = RobotControllerNode()
        planner = Planner()

    thumbnails_dir = VideoSaver.get_video_directory()
    rest_app.mount("/thumbnails", StaticFiles(directory=thumbnails_dir / "thumbnails"))
    rest_app.mount("/user_thumbnails", StaticFiles(directory=thumbnails_dir))
    uvicorn.run(rest_app, host=app_address, port=int(app_port), log_config=LOGGING_CONFIG)

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "()": "uvicorn.logging.DefaultFormatter",
            "fmt": "%(levelprefix)s %(message)s",
            "use_colors": None,
        },
        "access": {
            "()": "uvicorn.logging.AccessFormatter",
            "fmt": '%(levelprefix)s %(client_addr)s - "%(request_line)s" %(status_code)s',  # noqa: E501
        },
    },
    "handlers": {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stderr",
        },
        "access": {
            "formatter": "access",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stdout",
        },
    },
    "loggers": {
        "uvicorn": {"handlers": ["default"], "level": "TRACE", "propagate": False},
        "uvicorn.error": {"level": "TRACE"},
        "uvicorn.access": {"handlers": ["access"], "level": "TRACE", "propagate": False},
    },
}

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
