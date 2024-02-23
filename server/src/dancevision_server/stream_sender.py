import asyncio
import argparse

from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaRelay
from aiortc.contrib.media import MediaPlayer

from dancevision_server.peer_connection import PeerConnnection

relay = MediaRelay()

class StreamSender:

    def __init__(self, **kwargs):
        global relay

        self.emitter_pc = RTCPeerConnection()
        player = MediaPlayer(**kwargs)
        self.emitter_pc.addTrack(relay.subscribe(player.video))

    async def run(self, offer):
        return await PeerConnnection.negotiate_local_sender(self.emitter_pc, offer)
