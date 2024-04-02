import asyncio

from dancevision_server.pose_detection_track import PoseDetectionTrack
from dancevision_server.keypoint_responders.keypoint_responder import KeypointResponder
from dancevision_server.host_identifiers import SERVER_IDENTIFIER

from dancevision_server.mux.mux import Mux

class VideoStarter:

    def __init__(self, stream_address: str, stream_port: str, mux: Mux, keypoint_feedback: KeypointResponder, pose_track: PoseDetectionTrack, file: str, connection_offers: dict, connection_answers: dict):
        self.stream_address = stream_address
        self.stream_port = stream_port
        
        self.mux = mux
        self.streamer = None
        
        self.keypoint_feedback = keypoint_feedback
        self.pose_track = pose_track
        self.file = file

        self.connection_offers = connection_offers
        self.connection_answers = connection_answers

    async def start(self):
        offer = await VideoStarter.get_offer(self.connection_offers)
        kwargs = {"file": self.file}
        self.streamer = await self.mux.create_single_stream(offer, self.keypoint_feedback, self.pose_track, self.connection_offers, self.connection_answers, **kwargs)

    async def close(self):
        await self.streamer.close()

    @staticmethod
    async def get_offer(connection_offers):
        while SERVER_IDENTIFIER not in connection_offers:
            await asyncio.sleep(2)

        return connection_offers[SERVER_IDENTIFIER]
