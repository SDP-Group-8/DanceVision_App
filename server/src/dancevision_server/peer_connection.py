import urllib.parse
import json
import requests
from aiortc import RTCPeerConnection, RTCSessionDescription
import asyncio
from fastapi import status

from dancevision_server.host_identifiers import RASPBERRY_PI_IDENTIFIER, SERVER_IDENTIFIER

class PeerConnnection:
    @staticmethod
    def __get_url(address: str, port: int):
        return f"http://{address}:{port}"

    @staticmethod
    def __post_session_description(endpoint: str, pc: RTCPeerConnection, host_id: str, address: str, port: int):
        payload = {
            "sdp": pc.localDescription.sdp,
            "type": pc.localDescription.type,
            "host_id": host_id
        }
        return requests.post(f"{PeerConnnection.__get_url(address, port)}/{endpoint}", data = json.dumps(payload))

    @staticmethod
    async def __get_session_description(endpoint: str, host_id: str, address: str, port: int):
        status_code = status.HTTP_409_CONFLICT
        while status_code != status.HTTP_200_OK:
            url = f"{PeerConnnection.__get_url(address, port)}/{endpoint}?" + urllib.parse.urlencode({"host_id": host_id})
            res = requests.get(url)
            status_code = res.status_code
            await asyncio.sleep(1)
        return json.loads(requests.get(url).text)

    @staticmethod
    async def negotiate_receiver(pc: RTCPeerConnection, address: str, port: int, host_id: str = RASPBERRY_PI_IDENTIFIER):
        await pc.setLocalDescription(await pc.createOffer())
        PeerConnnection.__post_session_description("offer", pc, host_id, address, port)
        connection_answer = await PeerConnnection.__get_session_description("request-answer", host_id, address, port)
        remote_description = RTCSessionDescription(connection_answer["sdp"], connection_answer["type"])
        await pc.setRemoteDescription(remote_description)

    @staticmethod
    async def negotiate_sender(pc: RTCPeerConnection, address: str, port: int, host_id: str = SERVER_IDENTIFIER):
        connection_offer = await PeerConnnection.__get_session_description("request-offer", host_id, address, port)
        offer = RTCSessionDescription(sdp=connection_offer["sdp"], type=connection_offer["type"])
        await pc.setRemoteDescription(offer)
        answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        PeerConnnection.__post_session_description("answer", pc, host_id, address, port)
