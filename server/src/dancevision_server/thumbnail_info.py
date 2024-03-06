from __future__ import annotations

from dancevision_server.video_saver import VideoSaver
from pathlib import Path

class ThumbnailInfo:
    def __init__(self, video_filename: str):
        self.basename = Path(video_filename).stem
        self.thumbnail_filename = f"{self.basename}.{VideoSaver.thumbnail_extension}"
        self.video_filename = Path(video_filename).name

    def to_dict(self):
        return {
            "basename": self.basename,
            "thumbnail_filename": self.thumbnail_filename,
            "video_filename": self.video_filename
        }