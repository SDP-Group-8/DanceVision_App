from __future__ import annotations

from typing import Callable
from functools import partial

from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaPlayer

from pose_estimation.mediapipe import MediaPipe

from dancevision_server.peer_connection import PeerConnnection
from dancevision_server.pose_detection_track import PoseDetectionTrack
from dancevision_server.recorder import Recorder
from dancevision_server.score_channel import ScoreChannel

class StreamSender:

    def __init__(self, parameter_path: str, recorder: Recorder, on_connection_closed: Callable, on_pose_detections: Callable | None = None, **kwargs):
        self.emitter_pc = RTCPeerConnection()
        self.emitter_pc.addTransceiver("video", "sendonly")
        self.emitter_pc.addTransceiver("video", "sendonly")

        self.player = MediaPlayer(**kwargs)
        self.score_channel = None

        self.mediapipe = MediaPipe()
        self.mediapipe.initialize(parameter_path)

        self.on_pose_detections = partial(on_pose_detections, self.score_channel)
        self.pose_detection_track = PoseDetectionTrack(self.player.video, self.mediapipe, self.on_pose_detections)

        self.emitter_pc.addTrack(self.pose_detection_track)
        self.recorder = recorder

        @self.emitter_pc.on("datachannel")
        def on_datachannel(channel):
            self.score_channel = ScoreChannel(channel)
            self.pose_detection_track.update_pose_callack(partial(on_pose_detections, self.score_channel))

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
