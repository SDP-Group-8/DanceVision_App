from pose_estimation.interpolator import Interpolator
from pose_estimation.scoring.score import Score
from pose_estimation.keypoint_statistics import KeypointStatistics

class ScoreEstimator:

    def __init__(self, reference_keypoints, scorer: Score):
        self.reference_keypoints = reference_keypoints
        self.prev_timestamp = 0.0
        self.prev_keypoints = None
        self.scorer = scorer

    def find_score(self, timestamp_ms, detected_keypoints):    
        next_timestamp, next_keypoints = next(self.reference_keypoints)
        while next_timestamp < timestamp_ms:
            self.prev_timestamp = next_timestamp
            self.prev_keypoints = next_keypoints
            next_timestamp, next_keypoints = next(self.reference_keypoints)

        interpolator = Interpolator(self.prev_keypoints, next_keypoints)
        keypoints = interpolator.weighted_average(self.prev_timestamp, timestamp_ms, next_timestamp)

        detected_statistics = KeypointStatistics.from_keypoints(detected_keypoints)
        reference_statistics = KeypointStatistics.from_keypoints(keypoints)

        score = self.scorer.compute_score(detected_statistics, reference_statistics)
        component_scores = self.scorer.compute_each_score(detected_statistics, reference_statistics)

        return score, component_scores
