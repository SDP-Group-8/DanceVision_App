import os
import subprocess
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mediapipe import solutions
from pose_estimation.mediapipe import MediaPipe
from argparse import ArgumentParser

app = FastAPI()

parser = ArgumentParser()
parser.add_argument("--port", type=int, default="8000")
parser.add_argument("--host", type=str, default="localhost")

args = parser.parse_args()
port = args.port
host = args.host
print(port)
print(host)
url = f"http://{host}:{port}/"


# Handle origin permissions
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    img_output_path = os.path.join("uploads", "thumbnails", video.filename[0:-4]+".jpg")
    subprocess.call(['ffmpeg', '-i', destination_path, '-ss', '00:00:00.000', '-vframes', '1', img_output_path])

    return {"message": "File uploaded successfully"} 

# Retrieve thumbnail links array.
@app.get("/thumbnails")
async def get_thumbnails():
    thumbnail_dir = Path(os.path.join("uploads", "thumbnails"))
    thumbnails = [os.path.join(url, f"thumbnails/{thumbnail_file.name}") for thumbnail_file in thumbnail_dir.iterdir() if thumbnail_file.is_file()]
    return {"thumbnails": thumbnails}

# Retrive specific thumbnails
@app.get("/thumbnails/{filename}")
async def get_thumbnail(filename: str):
    thumbnail_directory = Path("uploads/thumbnails")
    file_path = thumbnail_directory / filename

    # Check if the file exists
    if not file_path.is_file() or file_path.suffix.lower() not in {'.jpg', '.jpeg', '.png'}:
        raise HTTPException(status_code=404, detail="File not found")

    # Return the file as a response
    return FileResponse(file_path, media_type="image/jpeg")  # Adjust media_type as needed

# Run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=host, port=port)
    # start the webcam consumer
    subprocess.Popen(["python3", "webcam_consumer.py", f"--host={host}", f"--port={port}"])