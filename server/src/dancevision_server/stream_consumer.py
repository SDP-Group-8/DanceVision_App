
import json
import requests
from aiortc import RTCPeerConnection, RTCSessionDescription
import asyncio
import argparse

import cv2

async def create_client(address: str, port: str):
    pc = RTCPeerConnection()
    pc.addTransceiver("video", "recvonly")

    @pc.on("track")
    async def on_track(track):
        print("got track")
        while True:
            frame = await track.recv()
            img = frame.to_ndarray(format="yuv420p")
            cv2.imshow("live_stream", img)
            cv2.waitKey(1)

    async def negotiate():
        await pc.setLocalDescription(await pc.createOffer())
        url = f"http://{address}:{port}/offer"
        payload = {"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}
        response = requests.post(url, data = json.dumps(payload))
        connection_answer = json.loads(response.text)
        remote_description = RTCSessionDescription(connection_answer["sdp"], connection_answer["type"])
        await pc.setRemoteDescription(remote_description)

    await asyncio.gather(negotiate(), asyncio.Event().wait())

def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("--address", dest="address")
    parser.add_argument("--port", dest="port")

    args = parser.parse_args()

    asyncio.run(create_client(args.address, args.port))
    

