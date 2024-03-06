from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaPlayer

from dancevision_server.peer_connection import PeerConnnection

class StreamSender:

    def __init__(self, **kwargs):
        self.emitter_pc = RTCPeerConnection()
        self.emitter_pc.addTransceiver("video", "sendonly")
        self.emitter_pc.addTransceiver("video", "sendonly")

        player = MediaPlayer(**kwargs)
        self.emitter_pc.addTrack(player.video)

    def add_second_track(self, **kwargs):
        player1 = MediaPlayer(**kwargs)
        self.emitter_pc.addTrack(player1.video)

    async def run(self, offer):
        return await PeerConnnection.negotiate_local_sender(self.emitter_pc, offer)
