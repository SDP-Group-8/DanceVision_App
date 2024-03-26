from __future__ import annotations

from aiortc import MediaStreamTrack
from av import VideoFrame

from dancevision_server.keypoint_responders.keypoint_feedback import KeypointFeedback

from pose_estimation.mediapipe import MediaPipe
from pose_estimation.single_window import SingleWindow

class PoseDetectionTrack(MediaStreamTrack):
    kind = "video"

    def __init__(self, track, mediapipe: MediaPipe, on_pose_detections: KeypointFeedback):
        super().__init__()  # don't forget this!
        self.track = track
        self.mediapipe = mediapipe
        self.keypoint_feedback = on_pose_detections
        self.single_window = None

    def show_window(self, img):
        if self.single_window is None:
            self.single_window = SingleWindow(array=img)
        self.single_window.show_image(img)

    async def recv(self):
        frame = await self.track.recv()

        img = frame.to_ndarray(format="bgr24")

        res = self.mediapipe.process_frame(img, int(frame.time * 1e3))
        if res:
            img = SingleWindow.draw_pose_on_image(img, res.to_normalized_landmarks())
            self.keypoint_feedback.keypoint_callback(res)
        self.show_window(img)

        # rebuild a VideoFrame, preserving timing information
        new_frame = VideoFrame.from_ndarray(img, format="bgr24")
        new_frame.pts = frame.pts
        new_frame.time_base = frame.time_base
        return new_frame
