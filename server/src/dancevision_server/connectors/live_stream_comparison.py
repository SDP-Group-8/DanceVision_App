from __future__ import annotations

from typing import Callable

from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaRelay
from pose_estimation.mediapipe import MediaPipe

from dancevision_server.connectors.connector import Connector
from dancevision_server.pose_detection_track import PoseDetectionTrack
from dancevision_server.peer_connection import PeerConnnection
from dancevision_server.movement_channel import MovementChannel
from dancevision_server.keypoint_responders.keypoint_responder import KeypointResponder

from dancevision_server.connectors.connector import Connector

class LiveStreamComparison(Connector):
    def __init__(self, parameter_path: str, on_connection_closed: Callable, on_pose_detections: KeypointResponder, **kwargs):
        self.relay = MediaRelay()

        self.receiver_pc = RTCPeerConnection()
        self.receiver_pc.addTransceiver("video", "recvonly")

        self.emitter_pc = RTCPeerConnection()
        self.emitter_pc.addTransceiver("video", "sendonly")

        self.keypoint_feedback = on_pose_detections
        self.connection_close_callback = on_connection_closed

        self.received_track = None
        self.pose_detection_track = None

        mediapipe = MediaPipe()
        mediapipe.initialize(parameter_path)

        @self.emitter_pc.on("datachannel")
        async def on_datachannel(channel):
            if channel.label == "movement":
                self.keypoint_feedback.set_movement_channel(MovementChannel(channel))

        @self.receiver_pc.on("track")
        async def on_track(track):
            self.received_track = track
            self.pose_detection_track = PoseDetectionTrack(self.relay.subscribe(track, buffered=False), mediapipe, on_pose_detections)
            self.emitter_pc.addTrack(self.pose_detection_track)

    async def close(self):
        await self.emitter_pc.close()
        await self.receiver_pc.close()
        self.connection_close_callback()

    async def negotiate_sender(self, offer):
        return await PeerConnnection.negotiate_local_sender(self.emitter_pc, offer)

    async def negotiate_receiver(self, answer):
        return await PeerConnnection.negotiate_local_receiver(self.receiver_pc, answer)
