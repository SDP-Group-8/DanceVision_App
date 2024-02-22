import asyncio
import argparse
import os

from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaRelay
from aiortc.contrib.media import MediaPlayer

from pose_estimation.mediapipe import MediaPipe

from dancevision_server.pose_detection_track import PoseDetectionTrack
from dancevision_server.peer_connection import PeerConnnection

relay = MediaRelay()

class StreamComparison:

    def __init__(self, address: str, port: str, parameter_path: str, video_path: str):
        self.receiver_pc = RTCPeerConnection()
        self.receiver_pc.addTransceiver("video", "recvonly")

        self.emitter_pc = RTCPeerConnection()

        self.address = address
        self.port = port

        mediapipe = MediaPipe()
        mediapipe.initialize(parameter_path)

        @self.receiver_pc.on("track")
        async def on_track(track):
            score_channel = self.emitter_pc.createDataChannel("score")

            player = MediaPlayer(video_path)
            self.emitter_pc.addTrack(player.video)

            self.emitter_pc.addTrack(
                PoseDetectionTrack(relay.subscribe(track), mediapipe)
            )

            await PeerConnnection.negotiate_sender(self.emitter_pc, self.address, self.port)

    async def run(self):
        await asyncio.gather(
            PeerConnnection.negotiate_receiver(self.receiver_pc, self.address, self.port),
            asyncio.Event().wait()
        )
