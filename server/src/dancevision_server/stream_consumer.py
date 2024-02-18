
import json
import requests
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaRelay
import asyncio
import argparse
import os
import logging
import urllib.parse
from fastapi import status

from pose_estimation.mediapipe import MediaPipe

from dancevision_server.host_identifiers import RASPBERRY_PI_IDENTIFIER, SERVER_IDENTIFIER
from dancevision_server.pose_detection_track import PoseDetectionTrack
from dancevision_server.websocket_server import emit_keypoints

relay = MediaRelay()

class PoseDetectionClient():
    def __init__(self, address: str, port: str, parameter_path: str):
        self.receiver_pc = RTCPeerConnection()
        self.receiver_pc.addTransceiver("video", "recvonly")

        self.address = address
        self.port = port

        self.logger = logging.Logger("pose_detection_client")

        self.emitter_pc = RTCPeerConnection()

        self.mediapipe = MediaPipe()
        self.mediapipe.initialize(parameter_path)

        @self.receiver_pc.on("track")
        async def on_track(track):
            self.emitter_pc.addTrack(
                PoseDetectionTrack(relay.subscribe(track), self.mediapipe, emit_keypoints)
            )

            await self.negotiate_sender()

    def __get_url(self):
        return f"http://{self.address}:{self.port}"

    def __post_session_description(self, endpoint: str, pc: RTCPeerConnection, host_id: str):
        payload = {
            "sdp": pc.localDescription.sdp,
            "type": pc.localDescription.type,
            "host_id": host_id
        }
        return requests.post(f"{self.__get_url()}/{endpoint}", data = json.dumps(payload))

    async def __get_session_description(self, endpoint: str, host_id: str):
        status_code = status.HTTP_409_CONFLICT
        while status_code != status.HTTP_200_OK:
            url = f"{self.__get_url()}/{endpoint}?" + urllib.parse.urlencode({"host_id": host_id})
            res = requests.get(url)
            print(res)
            status_code = res.status_code
            await asyncio.sleep(1)
        return json.loads(requests.get(url).text)

    async def negotiate_sender(self):
        connection_offer = await self.__get_session_description("request-offer", SERVER_IDENTIFIER)
        offer = RTCSessionDescription(sdp=connection_offer["sdp"], type=connection_offer["type"])
        await self.emitter_pc.setRemoteDescription(offer)
        answer = await self.emitter_pc.createAnswer()
        await self.emitter_pc.setLocalDescription(answer)
        self.__post_session_description("answer", self.emitter_pc, SERVER_IDENTIFIER)

    async def negotiate_receiver(self):
        await self.receiver_pc.setLocalDescription(await self.receiver_pc.createOffer())
        self.__post_session_description("offer", self.receiver_pc, RASPBERRY_PI_IDENTIFIER)
        connection_answer = await self.__get_session_description("request-answer", RASPBERRY_PI_IDENTIFIER)
        remote_description = RTCSessionDescription(connection_answer["sdp"], connection_answer["type"])
        await self.receiver_pc.setRemoteDescription(remote_description)

    async def run(self):
        await asyncio.gather(self.negotiate_receiver(), asyncio.Event().wait())


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("--address", dest="address")
    parser.add_argument("--port", dest="port")

    model_var_name = "MEDIAPIPE_MODEL_PATH"
    parser.add_argument("--parameter-path", dest="parameter_path",
                        default=os.environ[model_var_name] if model_var_name in os.environ else None)

    args = parser.parse_args()

    if args.parameter_path is None:
        raise RuntimeError(f"Model path not specified and not found in enviroment variable {model_var_name}")

    client = PoseDetectionClient(args.address, args.port, args.parameter_path)
    asyncio.run(client.run())
