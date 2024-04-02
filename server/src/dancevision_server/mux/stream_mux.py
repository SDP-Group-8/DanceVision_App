from __future__ import annotations

import asyncio
from functools import partial

from dancevision_server.connectors.stream_comparison import StreamComparison
from dancevision_server.connectors.live_stream_comparison import LiveStreamComparison

from dancevision_server.mux.local_mux import LocalMux
from dancevision_server.host_identifiers import SERVER_IDENTIFIER, RASPBERRY_PI_IDENTIFIER

class StreamMux:

    @staticmethod
    def get_connection_closed_callback(connection_offers: dict, connection_answers: dict):
        return partial(StreamMux.on_connection_closed, connection_offers, connection_answers)

    @staticmethod
    def on_connection_closed(connection_offers: dict, connection_answers: dict):        

        LocalMux.on_sender_connection_closed(connection_offers, connection_answers)
        
        if RASPBERRY_PI_IDENTIFIER in connection_offers:
            del connection_offers[RASPBERRY_PI_IDENTIFIER]

        if RASPBERRY_PI_IDENTIFIER in connection_answers:
            del connection_answers[RASPBERRY_PI_IDENTIFIER]

    @staticmethod
    async def set_offer_and_get_answer(connection_offers, connection_answers, local_offer):
        connection_offers[RASPBERRY_PI_IDENTIFIER] = local_offer
        while RASPBERRY_PI_IDENTIFIER not in connection_answers:
            await asyncio.sleep(2)
        return connection_answers[RASPBERRY_PI_IDENTIFIER]

    @staticmethod
    def get_negotiation_callback(connection_offers: dict, connection_answers: dict):
        return partial(StreamMux.set_offer_and_get_answer, connection_offers, connection_answers)

    @staticmethod
    async def create_dual_stream(offer, keypoint_feedback, pose_track, recorder, connection_offers, connection_answers, filepath, **kwargs):
        callback = StreamMux.get_connection_closed_callback(connection_offers, connection_answers)
        kwargs.update(LocalMux.get_base_kwargs(keypoint_feedback, pose_track))
        kwargs["file"] = str(filepath)
        comparison = StreamComparison(recorder, on_connection_closed=callback, **kwargs)
        answer = await comparison.negotiate_sender(offer)
        connection_answers[SERVER_IDENTIFIER] = answer

        await comparison.negotiate_receiver(StreamMux.get_negotiation_callback(connection_offers, connection_answers))
        return comparison

    @staticmethod
    async def create_single_stream(offer, keypoint_feedback, pose_track, connection_offers, connection_answers, **kwargs):
        callback = StreamMux.get_connection_closed_callback(connection_offers, connection_answers)
        sender = LiveStreamComparison(on_connection_closed=callback, **LocalMux.get_base_kwargs(keypoint_feedback, pose_track, **kwargs))
        answer = await sender.negotiate_sender(offer)
        connection_answers[SERVER_IDENTIFIER] = answer

        await sender.negotiate_receiver(StreamMux.get_negotiation_callback(connection_offers, connection_answers))
        return sender
