from __future__ import annotations

import os
import subprocess
from pathlib import Path

from dancevision_server.environment import model_var_name, server_root_name

from pose_estimation.mediapipe_video import MediaPipeVideo
from pose_estimation.timestamped_keypoints import TimestampedKeypoints

class VideoSaver:
    thumbnail_extension = "jpg"

    @staticmethod
    def get_video_directory():
        base_path = os.environ[server_root_name] if server_root_name in os.environ else os.getcwd() 
        return Path(base_path) / "uploads"

    @staticmethod
    def get_video_filepath(video_name: str):
        return VideoSaver.get_video_directory() / video_name

    @staticmethod
    def get_thumbnail_directory():
        return VideoSaver.get_video_directory() / "thumbnails"

    @staticmethod
    def get_thumbnail_filename(video_name: Path):
        return f"{video_name.stem}.{VideoSaver.thumbnail_extension}"

    @staticmethod
    def get_thumbnail_filepath(video_name: Path):
        return VideoSaver.get_thumbnail_directory() / VideoSaver.get_thumbnail_filename(video_name)

    @staticmethod
    def get_keypoint_directory():
        return VideoSaver.get_video_directory() / "keypoints"

    @staticmethod
    def get_keypoint_filename(video_name: Path):
        return f"{video_name.stem}.json"

    @staticmethod
    def get_keypoint_filepath(video_name: Path):
        return VideoSaver.get_keypoint_directory() / VideoSaver.get_keypoint_filename(video_name)

    def __init__(self, video, create_dirs=True):
        self.video = video
        self.file_data = video.file.read()
        self.file_size = len(self.file_data)
        self.video_filename = Path(self.video.filename)
        self.destination_path = VideoSaver.get_video_directory()

        if create_dirs:
            for dir in VideoSaver.get_thumbnail_directory(), VideoSaver.get_keypoint_directory():
                os.makedirs(dir, exist_ok=True)

    def validate(self):
        if self.video.content_type not in ('video/mp4', 'video/x-msvideo'):
            return {"message": "Invalid file format"}
        if self.file_size > (300 * pow(1024, 2)):  # 300 MB
            return {"message": "File size too large"}

    def save_video(self):
        with open(VideoSaver.get_video_filepath(self.video_filename), "wb") as f:
            f.write(self.file_data)

    def generate_thumbnail(self):
        img_output_path = VideoSaver.get_thumbnail_filepath(self.video_filename)
        subprocess.call([
            'ffmpeg',
            '-i',
            VideoSaver.get_video_filepath(self.video_filename),
            '-ss', '00:00:00.000',
            '-vframes',
            '1',
            img_output_path
        ])

    def save_keypoints(self):
        model_path = os.environ[model_var_name]
        mediapipe_video = MediaPipeVideo(str(VideoSaver.get_video_filepath(self.video_filename)), model_path)
        keypoints = mediapipe_video.estimate_video()
        text = TimestampedKeypoints.batch_serialize(keypoints)
        with open(VideoSaver.get_keypoint_filepath(self.video_filename), "w") as f:
            f.write(text)
