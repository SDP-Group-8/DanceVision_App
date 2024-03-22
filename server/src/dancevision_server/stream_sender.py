from __future__ import annotations

from typing import Callable
from functools import partial

from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaPlayer

from pose_estimation.keypoint_statistics import KeypointStatistics
from pose_estimation.mediapipe import MediaPipe

from dancevision_server.peer_connection import PeerConnnection
from dancevision_server.pose_detection_track import PoseDetectionTrack
from dancevision_server.recorder import Recorder
from dancevision_server.score_channel import ScoreChannel
from dancevision_server.movement_channel import MovementChannel
from dancevision_server.planners.planner import Planner

class StreamSender:

    def __init__(self, parameter_path: str, recorder: Recorder, planner: Planner, on_connection_closed: Callable, on_pose_detections: Callable | None = None, **kwargs):
        self.emitter_pc = RTCPeerConnection()
        self.emitter_pc.addTransceiver("video", "sendonly")
        self.emitter_pc.addTransceiver("video", "sendonly")

        self.player = MediaPlayer(**kwargs)
        self.score_channel = None
        self.movement_channel = None

        self.mediapipe = MediaPipe()
        self.mediapipe.initialize(parameter_path)

        def on_pose_detection(pose_detections):
            if planner is not None:
                statistics = KeypointStatistics.from_keypoints(pose_detections)
                res = planner.move_with_plan(statistics)
                if res and self.movement_channel:
                    self.movement_channel.send_ready_message()

        self.on_pose_detections = [on_pose_detection] if on_pose_detections is None else [on_pose_detection, partial(on_pose_detections, self.score_channel)]
        self.pose_detection_track = PoseDetectionTrack(self.player.video, self.mediapipe, self.on_pose_detections)

        self.emitter_pc.addTrack(self.pose_detection_track)
        self.recorder = recorder

        @self.emitter_pc.on("datachannel")
        def on_datachannel(channel):
            if channel.label == "score":
                self.score_channel = ScoreChannel(channel)
            elif channel.label == "movement":
                self.movement_channel = MovementChannel(channel)
            
            self.pose_detection_track.update_pose_callack([on_pose_detection, partial(on_pose_detections, self.score_channel)])

        @self.emitter_pc.on("connectionstatechange")
        async def on_state_changed():
            if self.emitter_pc.connectionState == "closed":
                self.player.video.stop()
                self.player1.video.stop()

                await self.recorder.stop()
                on_connection_closed()

    def add_second_track(self, **kwargs):
        self.player1 = MediaPlayer(**kwargs)
        self.emitter_pc.addTrack(self.player1.video)

    async def run(self, offer):
        if self.recorder:
            self.recorder.addTrack(self.player.video)
            await self.recorder.start()

        return await PeerConnnection.negotiate_local_sender(self.emitter_pc, offer)
