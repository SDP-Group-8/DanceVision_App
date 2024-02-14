
import json
import requests
from aiortc import RTCPeerConnection, RTCSessionDescription
import asyncio
import argparse

async def create_client(address: str, port: str):
    pc = RTCPeerConnection()
    pc.addTransceiver("video", "recvonly")
    async def negotiate():
        await pc.setLocalDescription(await pc.createOffer())
        # send offer via http
        offer = pc.localDescription.sdp
        url = f"http://{address}:{port}/offer"
        x = requests.post(url, data = offer)
        answer_string = json.loads(x.text)
        remote_description = RTCSessionDescription(answer_string["answer"], "answer")
        await pc.setRemoteDescription(remote_description)

    async def check_connecton():
        while pc.connectionState != "connected":
            await asyncio.sleep(1)

        while pc.connectionState == "connected":
            print("connected")
            await asyncio.sleep(1)

    await asyncio.gather(negotiate(), check_connecton())

def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("--address", dest="address")
    parser.add_argument("--port", dest="port")

    args = parser.parse_args()

    asyncio.run(create_client(args.address, args.port))
    

