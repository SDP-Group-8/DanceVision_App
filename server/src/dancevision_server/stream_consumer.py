from __future__ import annotations

from aiortc import RTCPeerConnection
import asyncio
import argparse
import mediapipe as mp
import argparse

from pose_estimation.single_window import SingleWindow

from dancevision_server.peer_connection import PeerConnnection
from dancevision_server.host_identifiers import RASPBERRY_PI_IDENTIFIER

class PoseDetectionClient():
    def __init__(self, address: str, port: str):
        self.receiver_pc = RTCPeerConnection()
        self.receiver_pc.addTransceiver("video", "recvonly")

        self.address = address
        self.port = port

        @self.receiver_pc.on("connectionstatechange")
        async def on_connectionstatechange():
            if self.receiver_pc.connectionState == "closed":
                PeerConnnection.register_connection_closed(self.address, self.port, RASPBERRY_PI_IDENTIFIER)

        @self.receiver_pc.on("track")
        async def on_track(track):
            image = await get_image(track)
            self.single_window = SingleWindow(image=image)
            while True:
                self.single_window.show_image((await get_image(track)).numpy_view())

        async def get_image(track):
            data = await track.recv()
            return mp.Image(
                image_format = mp.ImageFormat.SRGB,
                data = data.to_ndarray(format="bgr24")
            )

    async def run(self):
        args = [self.receiver_pc, self.address, self.port]
        return await PeerConnnection.negotiate_receiver(*args)

def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("--address", dest="address")
    parser.add_argument("--port", dest="port")

    args = parser.parse_args()

    async def run():
        client = PoseDetectionClient(args.address, args.port)
        await asyncio.gather(client.run(), asyncio.Event().wait())
    
    asyncio.run(run())
