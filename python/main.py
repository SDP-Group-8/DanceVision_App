from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel  # For data validation (optional) 
import os

class Item(BaseModel):
    name: str
    description: str

    
app = FastAPI()
origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*","Content-Type", "Content-Length", "Content-Range"],  # Allow all headers
)

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

    return {"message": "File uploaded successfully"} 