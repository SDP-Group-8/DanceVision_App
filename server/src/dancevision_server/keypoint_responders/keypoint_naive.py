from dancevision_server.planners.planner import Planner
from dancevision_server.score_channel import ScoreChannel
from dancevision_server.movement_channel import MovementChannel
from dancevision_server.keypoint_responders.keypoint_responder import KeypointResponder

class KeypointNaive(KeypointResponder):

    def __init__(self):
        self.score_channel = None
        self.movement_channel = None
        self.result = None

    def set_score_channel(self, score_channel: ScoreChannel):
        self.score_channel = score_channel
        
    def set_movement_channel(self, movement_channel: MovementChannel):
        self.movement_channel = movement_channel

    def keypoint_callback(self, pose_detections):
        if self.movement_channel:
            self.movement_channel.send_ready_message()
