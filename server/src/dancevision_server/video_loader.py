import os
from pose_estimation.timestamped_keypoint_serializer import TimestampedKeypointsSerializer

from dancevision_server.video_saver import VideoSaver

class VideoLoader:
    def __init__(self, video_name):
        self.video_name = video_name

    def load_keypoints(self):
        filename = VideoSaver.get_keypoint_filepath(self.video_name)
        
        if not os.path.isfile(filename):
            return None

        with open(filename, "r") as f:
            text = TimestampedKeypointsSerializer.batch_deserialize(f.read())
            return text
