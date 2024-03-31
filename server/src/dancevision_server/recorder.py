import os
from datetime import datetime

from aiortc.contrib.media import MediaRecorder

from dancevision_server.video_saver import VideoSaver
from dancevision_server.thumbnail_creator import ThumbnailCreator

class Recorder:
    recording_format = "mp4"

    @staticmethod
    def get_thumbnail_filename(datetime: datetime):
        return f"{datetime.isoformat()}.{ThumbnailCreator.thumbnail_extension}"

    @staticmethod
    def get_thumbnail_directory(user_id: str):
        return Recorder.get_user_recording_directory(user_id) / "thumbnails"

    @staticmethod
    def get_thumbnail_filepath(user_id: str, datetime: datetime):
        return Recorder.get_thumbnail_directory(user_id) / Recorder.get_thumbnail_filename(datetime)

    @staticmethod
    def get_user_recording_directory(user_id: str):
        return VideoSaver.get_video_directory() / user_id

    @staticmethod
    def get_user_recording_filepath(user_id: str, datetime: datetime):
        return Recorder.get_user_recording_directory(user_id) / f"{datetime.isoformat()}.{Recorder.recording_format}"

    def initialize(self, user_id: str, create_dirs = True):
        self.user_id = user_id
        self.date = datetime.now()
        self.file = Recorder.get_user_recording_filepath(user_id, self.date)
        
        if create_dirs:
            os.makedirs(str(self.file.parent), exist_ok=True)
            os.makedirs(Recorder.get_thumbnail_directory(user_id), exist_ok=True)

        self.recorder = MediaRecorder(str(self.file))

    def generate_thumbnail(self):
        img_output_path = Recorder.get_thumbnail_filepath(self.user_id, self.date)
        ThumbnailCreator.create(self.file, img_output_path)

    def addTrack(self, track):
        self.recorder.addTrack(track)

    async def start(self):
        await self.recorder.start()

    async def stop(self):
        await self.recorder.stop()
        self.generate_thumbnail()

    def get_recording_datetime(self):
        return self.date
