from pose_estimation.keypoints import Keypoints

class ScoreAggregator:
    
    def __init__(self):
        self.scores = {f"{name}": [] for name in Keypoints.ordered_fields}

    def add_scores(self, dct):
        for field in Keypoints.ordered_fields:
            self.scores[field].append(dct[field])

    def get_all_scores(self):
        return self.scores
