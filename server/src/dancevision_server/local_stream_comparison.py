import asyncio

from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaRelay
from aiortc.contrib.media import MediaPlayer

from pose_estimation.mediapipe import MediaPipe

from dancevision_server.pose_detection_track import PoseDetectionTrack
from dancevision_server.peer_connection import PeerConnnection

relay = MediaRelay()

class LocalStreamComparison:

    def __init__(self, parameter_path: str, video_path: str, offer):
        self.receiver_pc = RTCPeerConnection()
        self.receiver_pc.addTransceiver("video", "recvonly")

        self.emitter_pc = RTCPeerConnection()
        self.answer = None
        self.task = asyncio.Future()

        mediapipe = MediaPipe()
        mediapipe.initialize(parameter_path)

        @self.receiver_pc.on("track")
        async def on_track(track):
            player = MediaPlayer(video_path)
            self.emitter_pc.addTrack(player.video)

            self.emitter_pc.addTrack(
                PoseDetectionTrack(relay.subscribe(track), mediapipe)
            )

            answer = await PeerConnnection.negotiate_local_sender(self.emitter_pc, offer)
            self.task.set_result(answer)

    async def start_receiver(self, get_answer):
        await PeerConnnection.negotiate_local_receiver(self.receiver_pc, get_answer)
        
    async def get_answer(self):
        return await self.task
