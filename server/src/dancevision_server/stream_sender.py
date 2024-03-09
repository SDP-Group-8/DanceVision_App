from __future__ import annotations

from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaPlayer

from dancevision_server.peer_connection import PeerConnnection
from dancevision_server.host_identifiers import SERVER_IDENTIFIER

class StreamSender:

    def __init__(self, **kwargs):
        self.emitter_pc = RTCPeerConnection()
        self.emitter_pc.addTransceiver("video", "sendonly")
        self.emitter_pc.addTransceiver("video", "sendonly")

        player = MediaPlayer(**kwargs)
        self.emitter_pc.addTrack(player.video)

        @self.emitter_pc.on("connectionstatechange")
        async def on_state_changed():    
            if self.emitter_pc.connectionState == "closed":
                PeerConnnection.register_connection_closed(self.address, self.port, SERVER_IDENTIFIER)

    def add_second_track(self, **kwargs):
        player1 = MediaPlayer(**kwargs)
        self.emitter_pc.addTrack(player1.video)

    async def run(self, offer):
        return await PeerConnnection.negotiate_local_sender(self.emitter_pc, offer)
