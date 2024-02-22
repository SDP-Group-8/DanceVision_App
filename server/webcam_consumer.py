import json
import time
import requests
from aiortc import RTCPeerConnection, RTCSessionDescription
import asyncio
from argparse import ArgumentParser
import subprocess

parser = ArgumentParser()
parser.add_argument("--host", type=str, default="localhost")
parser.add_argument("--port", type=int, default=8000)
host = parser.parse_args().host
port = parser.parse_args().port

async def main(host, port):
    pc = RTCPeerConnection()
    pc.addTransceiver("video", "recvonly")
    @pc.on("track")
    async def on_track(track):
        while True:
            frame = await track.recv()
            img = frame.to_ndarray(format="bgr24")
            timestamp = time.time_ns()
            if "prev_timestamp" in locals():
                print(timestamp - prev_timestamp)
            prev_timestamp = timestamp

    
    url = f"http://{host}:{str(port)}/"
    async def negotiate():
        await pc.setLocalDescription(await pc.createOffer())
        # send offer via http
        offer = pc.localDescription.sdp
        print("offer")
        print(offer)
        offer_endpoint = url + "offer" 
        x = requests.post(offer_endpoint, data = offer)
        answer_string = json.loads(x.text)
        print("answer")
        print(answer_string["answer"])
        remote_description = RTCSessionDescription(answer_string["answer"], "answer")
        await pc.setRemoteDescription(remote_description)
        print("exchange done")

    async def check_connecton():
        while pc.connectionState != "connected":
            await asyncio.sleep(1)

        while pc.connectionState == "connected":
            print("connected")
            await asyncio.sleep(1)

    await asyncio.gather(negotiate(), check_connecton())

asyncio.run(main(host, port))