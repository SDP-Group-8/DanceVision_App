from __future__ import annotations

from dancevision_server.score_channel import ScoreChannel
from dancevision_server.movement_channel import MovementChannel
from dancevision_server.planners.planner import Planner
from dancevision_server.keypoint_responders.keypoint_responder import KeypointResponder

from pose_estimation.keypoint_statistics import KeypointStatistics

class KeypointFeedback(KeypointResponder):

    def __init__(self, planner: Planner):
        self.score_channel = None
        self.movement_channel = None
        self.planner = planner
        self.result = None

    def set_score_channel(self, score_channel: ScoreChannel):
        self.score_channel = score_channel
        
    def set_movement_channel(self, movement_channel: MovementChannel):
        self.movement_channel = movement_channel

    def keypoint_callback(self, pose_detections):
        if self.planner is not None and self.result is None:
            statistics = KeypointStatistics.from_keypoints(pose_detections)
            self.planner.move_with_plan(statistics)

        if self.planner and self.movement_channel:
            self.result = self.planner.get_result()
            if self.result != False:
                self.movement_channel.send_ready_message()
