import os
from pathlib import Path
import subprocess
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
url = 'http://localhost:8000'

origins = [
    'http://localhost:5173'
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

    destination_path = "uploads/" + video.filename
    os.makedirs(os.path.dirname(destination_path), exist_ok=True)

    with open(destination_path, "wb") as f:
        f.write(file_data)

    # generate thumbnail
    img_output_path = "uploads/thumbnails/" + video.filename[0:-4] + ".jpg"
    subprocess.call(['ffmpeg', '-i', destination_path, '-ss', '00:00:00.000', '-vframes', '1', img_output_path])

    return {"message": "File uploaded successfully"} 

# Retrieve thumbnail icons.
@app.get("/thumbnails")
async def get_thumbnails():
    thumbnail_dir = Path("uploads/thumbnails")
    thumbnails = []
    for thumbnail_file in thumbnail_dir.iterdir():
        if thumbnail_file.is_file():
            thumbnail_url = url + "/" + f"{thumbnail_file.name}"
            thumbnails.append(thumbnail_url)
    return {"thumbnails": thumbnails}