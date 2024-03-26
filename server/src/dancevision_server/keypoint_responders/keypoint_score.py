from __future__ import annotations

from dancevision_server.score_channel import ScoreChannel
from dancevision_server.movement_channel import MovementChannel
from dancevision_server.score_aggregator import ScoreAggregator
from dancevision_server.score_estimator import ScoreEstimator
from dancevision_server.keypoint_responders.keypoint_responder import KeypointResponder

class KeypointScore(KeypointResponder):

    def __init__(self, score_estimator: ScoreEstimator, score_aggregator: ScoreAggregator):
        self.score_channel = None
        self.score_estimator = score_estimator
        self.score_aggregator = score_aggregator
        self.result = None

    def set_score_channel(self, score_channel: ScoreChannel):
        self.score_channel = score_channel
        
    def set_movement_channel(self, movement_channel: MovementChannel):
        self.movement_channel = movement_channel

    def keypoint_callback(self, pose_detections):
        if self.score_estimator and self.score_aggregator and self.score_channel:
            score, component_scores = self.score_estimator.find_score(0, pose_detections)
            self.score_channel.send_score_message(score)
            self.score_aggregator.add_scores(component_scores)
