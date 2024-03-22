from __future__ import annotations

from pose_estimation.keypoint_statistics import KeypointStatistics


from abc import ABC, abstractmethod


class Planner(ABC):
    @abstractmethod
    def move_with_plan(self, keypoints: KeypointStatistics):
        pass
