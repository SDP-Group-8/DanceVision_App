from __future__ import annotations

from typing import Callable

from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaPlayer

from dancevision_server.connectors.connector import Connector
from dancevision_server.keypoint_responders.keypoint_responder import KeypointResponder
from dancevision_server.peer_connection import PeerConnnection
from dancevision_server.pose_detection_track import PoseDetectionTrack
from dancevision_server.recorder import Recorder
from dancevision_server.score_channel import ScoreChannel

class StreamSender(Connector):

    def __init__(self, pose_track: PoseDetectionTrack, on_connection_closed: Callable, on_pose_detections: KeypointResponder, **kwargs):
        self.emitter_pc = RTCPeerConnection()
        self.emitter_pc.addTransceiver("video", "sendonly")
        self.emitter_pc.addTransceiver("video", "sendonly")

        self.player = MediaPlayer(**kwargs)
        self.score_channel = None
        self.movement_channel = None

        self.on_connection_closed = on_connection_closed
        self.keypoint_feedback = on_pose_detections

        pose_track.set_track(self.player.video)
        self.pose_detection_track = pose_track

        self.emitter_pc.addTrack(self.pose_detection_track)

        @self.emitter_pc.on("datachannel")
        def on_datachannel(channel):
            if channel.label == "score":
                self.keypoint_feedback.set_score_channel(ScoreChannel(channel))

        @self.emitter_pc.on("connectionstatechange")
        async def on_state_changed():
            if self.emitter_pc.connectionState == "closed":
                await self.close()

    async def close(self):
        self.player.video.stop()
        self.player1.video.stop()

        await self.recorder.stop()
        self.on_connection_closed()

    async def add_second_track(self, recorder: Recorder, **kwargs):
        self.player1 = MediaPlayer(**kwargs)
        self.emitter_pc.addTrack(self.player1.video)

        self.recorder = recorder
        self.recorder.addTrack(self.player.video)
        await self.recorder.start()

    async def run(self, offer):
        return await PeerConnnection.negotiate_local_sender(self.emitter_pc, offer)
