from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaRelay
import asyncio
import argparse
import mediapipe as mp

from pose_estimation.single_window import SingleWindow

from dancevision_server.peer_connection import PeerConnnection
from dancevision_server.host_identifiers import SERVER_IDENTIFIER

relay = MediaRelay()

class PoseDetectionClient():
    def __init__(self, address: str, port: str, host_id: str = None):
        self.receiver_pc = RTCPeerConnection()
        self.receiver_pc.addTransceiver("video", "recvonly")

        self.address = address
        self.port = port
        self.host_id = host_id

        @self.receiver_pc.on("connectionstatechange")
        async def on_connectionstatechange():
            print(f"Connection state is {self.receiver_pc.connectionState}")

        @self.receiver_pc.on("track")
        async def on_track(track):
            print("got track")
            print(type(track))
            self.single_window = SingleWindow(image=await get_image(track))
            print("create window")
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

        if self.host_id is not None:
            args.append(self.host_id)

        await asyncio.gather(
            PeerConnnection.negotiate_receiver(*args),
            asyncio.Event().wait()
        )


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("--address", dest="address")
    parser.add_argument("--port", dest="port")
    parser.add_argument("--from-server", dest="from_server", action="store_true")

    args = parser.parse_args()

    client = PoseDetectionClient(args.address, args.port, SERVER_IDENTIFIER if args.from_server else None)
    asyncio.run(client.run())
