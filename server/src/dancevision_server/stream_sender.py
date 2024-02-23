import asyncio
import argparse

from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaRelay
from aiortc.contrib.media import MediaPlayer

from dancevision_server.peer_connection import PeerConnnection

relay = MediaRelay()

class StreamSender:

    def __init__(self, address: str, port: str, video_path: str):
        global relay
        global player

        self.emitter_pc = RTCPeerConnection()

        self.address = address
        self.port = port

        player = MediaPlayer(video_path)

        relay = MediaRelay()
        self.emitter_pc.addTrack(relay.subscribe(player.video))

    def run(self, offer):
        return PeerConnnection.negotiate_local_sender(self.emitter_pc, offer)
