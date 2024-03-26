from pose_estimation.keypoints import Keypoints

class ScoreAggregator:
    
    def __init__(self):
        self.scores = {f"{name}": [] for name in Keypoints.ordered_fields}
        self.avgScores = {f"{name}": 0 for name in Keypoints.ordered_fields}

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
        return sum(self.get_avg_scores().values()) / len(Keypoints.ordered_fields)
    
    def calculate_accuracy_over_time(self):
        accuracy_over_time  = []
        first_field = Keypoints.ordered_fields[0]
        for index in range(len(self.scores[first_field])):
            sum = 0
            for field_name in Keypoints.ordered_fields:
                sum += self.scores[field_name][index]
            
            avg = sum/len(Keypoints.ordered_fields)
            accuracy_over_time.append(avg)

        return accuracy_over_time
