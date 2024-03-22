import json
from aiortc import RTCDataChannel

class MovementChannel:
    def __init__(self, data_channel: RTCDataChannel):
        self.data_channel = data_channel

    def send_ready_message(self):
        if self.data_channel is not None and self.data_channel.readyState == "open":
            payload = {"ready": True}
            self.data_channel.send(json.dumps(payload))
