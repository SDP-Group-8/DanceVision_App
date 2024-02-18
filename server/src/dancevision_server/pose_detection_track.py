from typing import Callable

from aiortc import MediaStreamTrack
from av import VideoFrame

from pose_estimation.mediapipe import MediaPipe
from pose_estimation.single_window import SingleWindow

class PoseDetectionTrack(MediaStreamTrack):
    kind = "video"

    def __init__(self, track, mediapipe: MediaPipe, on_pose_detections: Callable | None = None):
        super().__init__()  # don't forget this!
        self.track = track
        self.mediapipe = mediapipe
        self.on_pose_detections = on_pose_detections

    async def recv(self):
        frame = await self.track.recv()

        # rotate image
        img = frame.to_ndarray(format="bgr24")

        res = self.mediapipe.process_frame(img, int(frame.time * 1e3))
        if res:
            img = SingleWindow.draw_pose_on_image(img, res.to_normalized_landmarks())
            if self.on_pose_detections:
                await self.on_pose_detections(res)

        # rebuild a VideoFrame, preserving timing information
        new_frame = VideoFrame.from_ndarray(img, format="bgr24")
        new_frame.pts = frame.pts
        new_frame.time_base = frame.time_base
        return new_frame
