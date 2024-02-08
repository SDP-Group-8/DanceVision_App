import asyncio
import os
import subprocess
from pathlib import Path

from fastapi import FastAPI, File, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from aiortc import RTCPeerConnection, RTCSessionDescription

from sse_starlette.sse import EventSourceResponse
from starlette.requests import Request


app = FastAPI()
url = 'http://localhost:8000'

origins = [
    'http://localhost:5173',
    'http://localhost:9992'
]

# Handle origin permissions
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*","Content-Type", "Content-Length", "Content-Range"]
)

# Handle HTTP post request to upload video.
@app.post("/upload-video")
async def upload_video(video: UploadFile = File(...)):

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
@app.get("/thumbnails")
async def get_thumbnails():
    thumbnail_dir = Path(os.path.join("uploads", "thumbnails"))
    thumbnails = [os.path.join(url, f"{thumbnail_file.name}") for thumbnail_file in thumbnail_dir.iterdir() if thumbnail_file.is_file()]
    return {"thumbnails": thumbnails}

offer_string = ""
answer_string =   ""
start_robot = False

# Frontend sends offer
# Send back an offer
@app.post("/offer")
async def get_offer(request: Request):
    global offer_string
    global answer_string
    body = await request.body()
    offer_string = body.decode('utf-8')
    print("on offer")
    print("offer_string", offer_string)
    print("answer_string", answer_string)
    while answer_string == "":
        await asyncio.sleep(1)
    return {"answer": answer_string}

@app.get("/poll-robot-start")
async def poll_robot_start():
    global start_robot
    while not start_robot:
        await asyncio.sleep(1)
    return {"start": "True"}

# Backend requests offer
@app.get("/request-offer")
async def request_offer():
    global offer_string
    return {"offer": offer_string}

# Backend sends an answer
@app.post("/answer")
async def get_answer(request: Request):
    global answer_string
    global offer_string
    body = await request.body()
    answer_string = body.decode('utf-8')
    print("on answer")
    print("offer_string", offer_string)
    print("answer_string", answer_string)   
    return {"offer": offer_string}

@app.get("reset")
async def reset():
    global offer_string
    global answer_string
    offer_string = ""
    answer_string = ""
    return {"message": "Reset successful"}
