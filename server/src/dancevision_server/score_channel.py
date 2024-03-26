from __future__ import annotations

from aiortc import RTCDataChannel

class ScoreChannel:
    def __init__(self, data_channel: RTCDataChannel):
        self.data_channel = data_channel

    def send_score_message(self, score: float):
        if self.data_channel is not None and self.data_channel.readyState == "open":
            self.data_channel.send(str(score))
