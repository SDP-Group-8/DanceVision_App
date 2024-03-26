from __future__ import annotations

import os
from functools import partial

from dancevision_server.mux.mux import Mux
from dancevision_server.keypoint_responders.keypoint_feedback import KeypointFeedback
from dancevision_server.environment import model_var_name
from dancevision_server.connectors.stream_sender import StreamSender
from dancevision_server.connectors.live_stream_sender import LiveStreamSender
from dancevision_server.host_identifiers import SERVER_IDENTIFIER

class LocalMux(Mux):

    @staticmethod
    def get_base_kwargs(keypoint_feedback: KeypointFeedback, **kwargs):
        kwargs.update({
            "on_pose_detections": keypoint_feedback,
            "parameter_path": os.environ[model_var_name],
        })

        return kwargs

    @staticmethod
    def get_connection_closed_callback(connection_offers: dict, connection_answers: dict):
        return partial(LocalMux.on_sender_connection_closed, connection_offers, connection_answers)

    @staticmethod
    def on_sender_connection_closed(connection_offers: dict, connection_answers: dict):
        if SERVER_IDENTIFIER in connection_offers:
            del connection_offers[SERVER_IDENTIFIER]

        if SERVER_IDENTIFIER in connection_answers:
            del connection_answers[SERVER_IDENTIFIER]

    @staticmethod
    async def create_dual_stream(offer, keypoint_feedback, recorder, connection_offers, connection_answers, filepath, **kwargs):
        callback = LocalMux.get_connection_closed_callback(connection_offers, connection_answers)
        comparison = StreamSender(on_connection_closed=callback, **LocalMux.get_base_kwargs(keypoint_feedback, **kwargs))

        answer = await comparison.run(offer)
        await comparison.add_second_track(recorder, **{"file": str(filepath)})
        connection_answers[SERVER_IDENTIFIER] = answer
        return comparison

    @staticmethod
    async def create_single_stream(offer, keypoint_feedback, connection_offers, connection_answers, **kwargs):
        callback = LocalMux.get_connection_closed_callback(connection_offers, connection_answers)
        sender = LiveStreamSender(on_connection_closed=callback, **LocalMux.get_base_kwargs(keypoint_feedback, **kwargs))
        answer = await sender.run(offer)
        connection_answers[SERVER_IDENTIFIER] = answer
        return sender
