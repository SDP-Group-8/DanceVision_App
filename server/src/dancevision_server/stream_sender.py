import asyncio
import argparse

from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaRelay
from aiortc.contrib.media import MediaPlayer

from dancevision_server.peer_connection import PeerConnnection

relay = None
player = None

class StreamSender:

    def __init__(self, address: str, port: str, video_path: str, format: str = None):
        global relay
        global player

        self.emitter_pc = RTCPeerConnection()

        self.address = address
        self.port = port

        options = {"framerate": "30", "video_size": "640x480"}
        player = MediaPlayer(video_path, format, options=None if format is None else options)

        relay = MediaRelay()
        self.emitter_pc.addTrack(relay.subscribe(player.video))

        @self.emitter_pc.on("connectionstatechange")
        async def on_connectionstatechange():
            print(f"Connection state is {self.emitter_pc.connectionState}")

    async def run(self):
        await asyncio.gather(
            PeerConnnection.negotiate_sender(self.emitter_pc, self.address, self.port),
            asyncio.Event().wait()
        )

def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("--address", dest="address")
    parser.add_argument("--port", dest="port")

    parser.add_argument("--stream-from", dest="stream_from")
    parser.add_argument("--format", dest="format")

    args = parser.parse_args()

    client = StreamSender(args.address, args.port, args.stream_from, args.format)
    asyncio.run(client.run())
