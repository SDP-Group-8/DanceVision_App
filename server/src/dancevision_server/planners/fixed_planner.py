from pose_estimation.keypoint_statistics import KeypointStatistics
from dancevision_server.planners.planner import Planner
from robot_controller.robot_controller_node import RobotControllerNode

class FixedPlanner(Planner):
    def __init__(self):
        self.robot_controller = RobotControllerNode()

    def __move_base(self, x: float, y: float, yaw: float):
        self.robot_controller.set_goal(x, y, yaw)

    def get_result(self):
        return self.robot_controller.get_result()

    def move_with_plan(self, keypoints: KeypointStatistics):
        result = self.get_result()
        if result != False:
            return True
        self.__move_base(0.0, 0.0, 0.1)
        self.robot_controller.set_height(50.0)
