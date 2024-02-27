import asyncio
import argparse
import os

from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaRelay

from pose_estimation.mediapipe import MediaPipe

from dancevision_server.pose_detection_track import PoseDetectionTrack
from dancevision_server.environment import model_var_name
from dancevision_server.peer_connection import PeerConnnection

relay = MediaRelay()

class StreamRelay:

    def __init__(self, address: str, port: str, parameter_path: str):
        self.receiver_pc = RTCPeerConnection()
        self.receiver_pc.addTransceiver("video", "recvonly")

        self.emitter_pc = RTCPeerConnection()
        self.emitter_pc.addTransceiver("video", "sendonly")

        self.address = address
        self.port = port

        self.mediapipe = MediaPipe()
        self.mediapipe.initialize(parameter_path)

        @self.receiver_pc.on("track")
        async def on_track(track):
            score_channel = self.emitter_pc.createDataChannel("score")

            self.emitter_pc.addTrack(
                PoseDetectionTrack(relay.subscribe(track), self.mediapipe)
            )

            await PeerConnnection.negotiate_sender(self.emitter_pc, self.address, self.port)
        
    async def run(self):
        await asyncio.gather(
            PeerConnnection.negotiate_receiver(self.receiver_pc, self.address, self.port),
            asyncio.Event().wait()
        )

def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("--address", dest="address")
    parser.add_argument("--port", dest="port")

    parser.add_argument("--parameter-path", dest="parameter_path",
                        default=os.environ[model_var_name] if model_var_name in os.environ else None)

    args = parser.parse_args()

    if args.parameter_path is None:
        raise RuntimeError(f"Model path not specified and not found in enviroment variable {model_var_name}")

    client = StreamRelay(args.address, args.port, args.parameter_path)
    asyncio.run(client.run())