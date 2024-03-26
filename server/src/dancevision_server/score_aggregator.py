from pose_estimation.keypoints import Keypoints

class ScoreAggregator:
    
    def __init__(self):
        self.scores = {f"{name}": [] for name in Keypoints.ordered_fields}
        self.avgScores = {f"{name}": 0 for name in Keypoints.ordered_fields}
        self.accuracy_over_time  = []

    def add_scores(self, dct):
        for field in Keypoints.ordered_fields:
            self.scores[field].append(dct[field])

    def get_all_scores(self):
        return self.scores
    
    def get_avg_scores(self):
        for field in Keypoints.ordered_fields:
            temp = self.scores[field]
            self.avgScores[field] = sum(temp)/len(temp)
        return self.avgScores
    
    def get_total_score(self):
        sum = 0
        for field in Keypoints.ordered_fields:
            sum += self.avgScores[field]
        return sum/len(Keypoints.ordered_fields)
    
    def calculate_accuracy_over_time(self):
        for index, value in enumerate(Keypoints.ordered_fields["left_shoulder"]):
            sum = 0
            for field in Keypoints.ordered_fields:
                sum += self.scores[field][index]
            avg = sum/len(Keypoints.ordered_fields)
            self.accuracy_over_time.append(round(avg,2))

        return self.accuracy_over_time

            


