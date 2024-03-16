from __future__ import annotations

from typing import Callable

from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaPlayer

from dancevision_server.peer_connection import PeerConnnection
from dancevision_server.host_identifiers import SERVER_IDENTIFIER
from dancevision_server.recorder import Recorder

class StreamSender:

    def __init__(self, recorder: Recorder, on_connection_closed: Callable, **kwargs):
        self.emitter_pc = RTCPeerConnection()
        self.emitter_pc.addTransceiver("video", "sendonly")
        self.emitter_pc.addTransceiver("video", "sendonly")

        self.player = MediaPlayer(**kwargs)
        self.emitter_pc.addTrack(self.player.video)

        self.recorder = recorder

        @self.emitter_pc.on("connectionstatechange")
        async def on_state_changed():    
            if self.emitter_pc.connectionState == "closed":
                await self.recorder.stop()
                on_connection_closed()

    def add_second_track(self, **kwargs):
        player1 = MediaPlayer(**kwargs)
        self.emitter_pc.addTrack(player1.video)

    async def run(self, offer):
        if self.recorder:
            self.recorder.addTrack(self.player.video)
            await self.recorder.start()

        return await PeerConnnection.negotiate_local_sender(self.emitter_pc, offer)
