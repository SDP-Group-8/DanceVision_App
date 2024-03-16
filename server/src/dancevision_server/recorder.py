import os
from datetime import datetime

from aiortc.contrib.media import MediaRecorder

from dancevision_server.video_saver import VideoSaver

class Recorder:
    recording_format = "mp4"

    @staticmethod
    def get_user_recording_directory(video_name: str):
        return VideoSaver.get_video_directory() / video_name

    @staticmethod
    def get_user_recording_filepath(video_name: str, datetime: datetime):
        return Recorder.get_user_recording_directory(video_name) / f"{datetime.isoformat()}.{Recorder.recording_format}"

    def initialize(self, video_name: str, create_dirs = True):
        self.date = datetime.now()
        file = Recorder.get_user_recording_filepath(video_name, self.date)
        
        if create_dirs and not file.parent.exists():
            os.makedirs(str(file.parent))

        self.recorder = MediaRecorder(str(file))

    def addTrack(self, track):
        self.recorder.addTrack(track)

    async def start(self):
        await self.recorder.start()

    async def stop(self):
        await self.recorder.stop()

    def get_recording_datetime(self):
        return self.date
