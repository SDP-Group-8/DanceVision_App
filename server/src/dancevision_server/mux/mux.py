from __future__ import annotations

from abc import ABC, abstractmethod

class Mux(ABC):

    @staticmethod
    @abstractmethod
    async def create_dual_stream(offer, keypoint_feedback, recorder, connection_offers, connection_answers, filepath, **kwargs):
        pass

    @staticmethod
    @abstractmethod
    async def create_single_stream(offer, keypoint_feedback, connection_offers, connection_answers, **kwargs):
        pass
