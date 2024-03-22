from __future__ import annotations

from pose_estimation.keypoint_statistics import KeypointStatistics
from dancevision_server.planners.planner import Planner
from robot_controller.robot_controller_node import RobotControllerNode

class BasicPlanner(Planner):

    def __init__(self):
        self.robot_controller = RobotControllerNode()

    def __move_base(self, x: float, y: float, yaw: float):
        self.robot_controller.set_goal(x, y, yaw)

    def move_with_plan(self, keypoints: KeypointStatistics):
        presences = keypoints.keypoints.get_presences(0.3)

        top = presences["left_shoulder"] and presences["right_shoulder"]
        bottom = presences["left_ankle"] and presences["right_ankle"]

        if top and bottom:
            return True
        
        self.__move_base(-1.0, 0, 0)
        return False
