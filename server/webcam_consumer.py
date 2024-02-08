import json
import requests
from aiortc import RTCPeerConnection, RTCSessionDescription
import asyncio

async def main():
    pc = RTCPeerConnection()
    pc.addTransceiver("video", "recvonly")
    async def negotiate():
        await pc.setLocalDescription(await pc.createOffer())
        # send offer via http
        offer = pc.localDescription.sdp
        print("offer")
        print(offer)
        url = "http://127.0.0.1:8083/offer"
        x = requests.post(url, data = offer)
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

asyncio.run(main())