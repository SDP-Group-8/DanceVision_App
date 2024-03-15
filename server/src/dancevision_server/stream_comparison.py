from __future__ import annotations

from typing import Callable

from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaRelay
from aiortc.contrib.media import MediaPlayer

from pose_estimation.mediapipe import MediaPipe
from aiortc.rtcrtpsender import RTCRtpSender

from dancevision_server.pose_detection_track import PoseDetectionTrack
from dancevision_server.peer_connection import PeerConnnection
from dancevision_server.host_identifiers import SERVER_IDENTIFIER, RASPBERRY_PI_IDENTIFIER

class StreamComparison:

    def __init__(self, address: str, port: int, parameter_path: str, on_pose_detections: Callable | None = None, **kwargs):
        relay = MediaRelay()

        self.receiver_pc = RTCPeerConnection()
        self.receiver_pc.addTransceiver("video", "recvonly")

        self.emitter_pc = RTCPeerConnection()
        self.emitter_pc.addTransceiver("video", "sendonly")
        self.emitter_pc.addTransceiver("video", "sendonly")

        self.address = address
        self.port = port

        mediapipe = MediaPipe()
        mediapipe.initialize(parameter_path)

        @self.receiver_pc.on("track")
        async def on_track(track):
            player = MediaPlayer(**kwargs)
            self.emitter_pc.addTrack(player.video)

            self.emitter_pc.addTrack(
                PoseDetectionTrack(relay.subscribe(track, buffered=False), mediapipe, on_pose_detections)
            )

        @self.receiver_pc.on("connectionstatechange")
        async def on_receiver_state_changed():
            if self.receiver_pc.connectionState == "closed":
                self.on_connection_closed()

        @self.emitter_pc.on("connectionstatechange")
        async def on_emitter_state_changed():    
            if self.emitter_pc.connectionState == "closed":
                self.on_connection_closed()

    def on_connection_closed(self):
        for id in SERVER_IDENTIFIER, RASPBERRY_PI_IDENTIFIER:
            PeerConnnection.register_connection_closed(self.address, self.port, id)

    async def negotiate_sender(self, offer):
        return await PeerConnnection.negotiate_local_sender(self.emitter_pc, offer)

    async def negotiate_receiver(self, answer):
        return await PeerConnnection.negotiate_local_receiver(self.receiver_pc, answer)
