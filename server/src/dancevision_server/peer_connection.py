import urllib.parse
import json
import requests
from aiortc import RTCPeerConnection, RTCSessionDescription
import asyncio
from fastapi import status
from typing import Coroutine

from dancevision_server.host_identifiers import RASPBERRY_PI_IDENTIFIER, SERVER_IDENTIFIER

class PeerConnnection:
    @staticmethod
    def __get_url(address: str, port: int) -> str:
        """
        Get server url based on address and port
        :param address: server address
        :param port: server port
        :return: full address
        """
        return f"http://{address}:{port}"

    @staticmethod
    def __post_session_description(endpoint: str, desc: RTCSessionDescription, host_id: str, address: str, port: int):
        """
        Send a post request to a server including a session description as payload
        :param endpoint: server endpoint
        :param desc: the session description
        :param host_id: the id of the video source (to distinguish different connections)
        :param address: server address
        :param port: server port
        :return: response of the post request
        """
        payload = {
            "sdp": desc.sdp,
            "type": desc.type,
            "host_id": host_id
        }
        return requests.post(f"{PeerConnnection.__get_url(address, port)}/{endpoint}", data = json.dumps(payload))

    @staticmethod
    async def __get_session_description(endpoint: str, host_id: str, address: str, port: int):
        """
        Send a get request to a server to retrieve a session description
        :param endpoint: server endpoint
        :param host_id: the id of the video source (to distinguish different connections)
        :param address: server address
        :param port: server port
        :return: response of the get request
        """
        status_code = status.HTTP_409_CONFLICT
        while status_code != status.HTTP_200_OK:
            url = f"{PeerConnnection.__get_url(address, port)}/{endpoint}?" + urllib.parse.urlencode({"host_id": host_id})
            res = requests.get(url)
            status_code = res.status_code
            await asyncio.sleep(1)
        return json.loads(requests.get(url).text)

    @staticmethod
    async def negotiate_receiver(pc: RTCPeerConnection, address: str, port: int, host_id: str = RASPBERRY_PI_IDENTIFIER):
        """
        Negotiate a peer connection to receive video
        :param pc: uninitialized peer connection object
        :param address: server address
        :param port: server port
        :param host_id: the id of the video source (to distinguish different connections)
        """
        await pc.setLocalDescription(await pc.createOffer())
        PeerConnnection.__post_session_description("offer", pc.localDescription, host_id, address, port)
        connection_answer = await PeerConnnection.__get_session_description("request-answer", host_id, address, port)
        remote_description = RTCSessionDescription(connection_answer["sdp"], connection_answer["type"])
        await pc.setRemoteDescription(remote_description)

    @staticmethod
    async def negotiate_local_receiver(pc: RTCPeerConnection, get_answer: Coroutine):
        """
        Negotiate a peer connection to receive video
        :param pc: uninitialized peer connection object
        :param address: server address
        :param port: server port
        :param host_id: the id of the video source (to distinguish different connections)
        """
        offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        answer = await get_answer(offer)
        await pc.setRemoteDescription(answer)
        return offer

    @staticmethod
    async def negotiate_sender(pc: RTCPeerConnection, address: str, port: int, host_id: str = SERVER_IDENTIFIER):
        """
        Negotiate a peer connection to send video
        :param pc: uninitialized peer connection object
        :param address: server address
        :param port: server port
        :param host_id: the id of the video source (to distinguish different connections)
        """
        connection_offer = await PeerConnnection.__get_session_description("request-offer", host_id, address, port)
        offer = RTCSessionDescription(sdp=connection_offer["sdp"], type=connection_offer["type"])
        await PeerConnnection.negotiate_local_sender(pc, offer)
        PeerConnnection.__post_session_description("answer", pc.localDescription, host_id, address, port)

    @staticmethod
    async def negotiate_local_sender(pc: RTCPeerConnection, offer: RTCSessionDescription):
        """
        Negotiate a peer connection to send video (without querying the server)
        :param pc: uninitialized peer connection object
        :param offer: the offer made by the video consumer
        :return: the answer (session description)
        """
        await pc.setRemoteDescription(offer)
        answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        return answer
