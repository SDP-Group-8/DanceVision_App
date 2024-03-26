from __future__ import annotations

from pose_estimation.keypoints import Keypoints

from dancevision_server.score_channel import ScoreChannel
from dancevision_server.movement_channel import MovementChannel

from abc import ABC, abstractmethod

class KeypointResponder(ABC):
    @abstractmethod
    def keypoint_callback(self, keypoints: Keypoints):
        pass

    @abstractmethod
    def set_score_channel(self, score_channel: ScoreChannel):
        pass
        
    @abstractmethod
    def set_movement_channel(self, movement_channel: MovementChannel):
        pass
