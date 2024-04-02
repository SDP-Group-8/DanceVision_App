from __future__ import annotations

from typing import Callable

from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaPlayer

from dancevision_server.connectors.connector import Connector
from dancevision_server.keypoint_responders.keypoint_responder import KeypointResponder
from dancevision_server.peer_connection import PeerConnnection
from dancevision_server.pose_detection_track import PoseDetectionTrack
from dancevision_server.movement_channel import MovementChannel

class LiveStreamSender(Connector):

    def __init__(self, pose_track: PoseDetectionTrack, on_connection_closed: Callable, on_pose_detections: KeypointResponder, **kwargs):
        self.emitter_pc = RTCPeerConnection()
        self.emitter_pc.addTransceiver("video", "sendonly")

        self.player = MediaPlayer(**kwargs)
        self.score_channel = None
        self.movement_channel = None

        @self.emitter_pc.on("datachannel")
        def on_datachannel(channel):
            if channel.label == "movement":
                self.keypoint_feedback.set_movement_channel(MovementChannel(channel))

        self.keypoint_feedback = on_pose_detections
        self.on_connection_closed = on_connection_closed

        pose_track.set_track(self.player.video)
        self.pose_detection_track = pose_track

        self.emitter_pc.addTrack(self.pose_detection_track)

    async def close(self):
        if self.player.video.readyState == "live":
            await self.emitter_pc.close()
            self.player.video.stop()
        self.on_connection_closed()

    async def run(self, offer):
        return await PeerConnnection.negotiate_local_sender(self.emitter_pc, offer)
