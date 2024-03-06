import asyncio
from typing import Callable

from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaRelay
from aiortc.contrib.media import MediaPlayer

from pose_estimation.mediapipe import MediaPipe

from dancevision_server.pose_detection_track import PoseDetectionTrack
from dancevision_server.peer_connection import PeerConnnection

relay = MediaRelay()

class StreamComparison:

    def __init__(self, parameter_path: str, on_pose_detections: Callable | None = None, **kwargs):
        global relay

        self.receiver_pc = RTCPeerConnection()
        self.receiver_pc.addTransceiver("video", "recvonly")
        self.receiver_pc.addTransceiver("video", "recvonly")

        self.emitter_pc = RTCPeerConnection()
        self.emitter_pc.addTransceiver("video", "sendonly")
        self.emitter_pc.addTransceiver("video", "sendonly")

        mediapipe = MediaPipe()
        mediapipe.initialize(parameter_path)

        @self.receiver_pc.on("track")
        async def on_track(track):
            player = MediaPlayer(**kwargs)
            self.emitter_pc.addTrack(player.video)

            self.emitter_pc.addTrack(
                PoseDetectionTrack(relay.subscribe(track), mediapipe, on_pose_detections)
            )

    async def negotiate_sender(self, offer):
        return await PeerConnnection.negotiate_local_sender(self.emitter_pc, offer)

    async def negotiate_receiver(self, answer):
        return await PeerConnnection.negotiate_local_receiver(self.receiver_pc, answer)
