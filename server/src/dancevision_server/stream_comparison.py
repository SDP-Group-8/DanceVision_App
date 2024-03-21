from __future__ import annotations

import asyncio
from typing import Callable
from functools import partial

from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaRelay, MediaPlayer
from pose_estimation.mediapipe import MediaPipe

from dancevision_server.pose_detection_track import PoseDetectionTrack
from dancevision_server.peer_connection import PeerConnnection
from dancevision_server.recorder import Recorder
from dancevision_server.score_channel import ScoreChannel

class StreamComparison:

    def __init__(self, address: str, port: int, parameter_path: str, recorder: Recorder, on_connection_closed: Callable, on_pose_detections: Callable | None = None, **kwargs):
        relay = MediaRelay()

        self.receiver_pc = RTCPeerConnection()
        self.receiver_pc.addTransceiver("video", "recvonly")

        self.emitter_pc = RTCPeerConnection()
        self.emitter_pc.addTransceiver("video", "sendonly")
        self.emitter_pc.addTransceiver("video", "sendonly")

        self.score_channel = None
        self.pose_detection_track = None

        self.connection_close_callback = on_connection_closed

        self.player = None
        self.recorder = recorder

        self.address = address
        self.port = port

        mediapipe = MediaPipe()
        mediapipe.initialize(parameter_path)

        @self.emitter_pc.on("datachannel")
        async def on_datachannel(channel):
            self.score_channel = ScoreChannel(channel)
            while self.pose_detection_track is None:
                await asyncio.sleep(0.5)

            self.pose_detection_track.update_pose_callack(partial(on_pose_detections, self.score_channel))

        @self.receiver_pc.on("track")
        async def on_track(track):
            self.player = MediaPlayer(**kwargs)
            self.emitter_pc.addTrack(self.player.video)
            
            if self.recorder:
                self.recorder.addTrack(self.player.video)
                await self.recorder.start()

            self.pose_detection_track = PoseDetectionTrack(relay.subscribe(track, buffered=False), mediapipe, on_pose_detections)
            self.emitter_pc.addTrack(self.pose_detection_track)

        @self.receiver_pc.on("connectionstatechange")
        async def on_receiver_state_changed():
            if self.receiver_pc.connectionState == "closed":
                await self.on_connection_closed()

        @self.emitter_pc.on("connectionstatechange")
        async def on_emitter_state_changed():    
            print(self.emitter_pc.connectionState)
            if self.emitter_pc.connectionState == "closed":
                await self.on_connection_closed()

    async def on_connection_closed(self):
        await self.recorder.stop()
        if self.player is not None:
            self.player.video.stop()

        self.connection_close_callback()

    async def negotiate_sender(self, offer):
        return await PeerConnnection.negotiate_local_sender(self.emitter_pc, offer)

    async def negotiate_receiver(self, answer):
        return await PeerConnnection.negotiate_local_receiver(self.receiver_pc, answer)
