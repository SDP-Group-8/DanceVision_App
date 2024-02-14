from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import os
from pathlib import Path
import uvicorn

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

from aiortc import RTCSessionDescription, RTCPeerConnection
from aiortc.contrib.media import MediaPlayer, MediaRelay

from dancevision_server.session_description_offer import SessionDescriptionOffer

rest_app = FastAPI()

relay = None
webcam = None

pcs = set()

rest_app.add_middleware(
        CORSMiddleware,
        allow_origins=['http://localhost:5173'],
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

@rest_app.post("/stream_offer")
async def stream_offer(offer: SessionDescriptionOffer):
    """
    Negotiate a WebRTC connection and send the video track to the consumer
    :return: The SDP and type descriptors for the peer connection
    """
    global relay, webcam

    offer = RTCSessionDescription(sdp=offer.sdp, type=offer.type)

    pc = RTCPeerConnection()
    pcs.add(pc)

    @pc.on("connectionstatechange")
    async def on_connectionstatechange():
        print("Connection state is %s" % pc.connectionState)
        if pc.connectionState == "failed":
            await pc.close()
            pcs.discard(pc)

    
    options = {"framerate": "30", "video_size": "640x480"}
    
    if webcam is None:
        webcam = MediaPlayer(
            "/dev/video0", format="v4l2", options=options
        )
        
    relay = MediaRelay()
    stream = relay.subscribe(webcam.video)
    video_sender = pc.addTrack(stream)

    await pc.setRemoteDescription(offer)

    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    return JSONResponse({"sdp": pc.localDescription.sdp, "type": pc.localDescription.type})

def main():
    uvicorn.run(rest_app)