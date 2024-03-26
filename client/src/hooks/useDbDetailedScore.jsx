import axios from 'axios';
import { useState, useEffect} from 'react';

const useDbDetailedScore = (url, username, video_id, options = {}) => {
  const [score, setScore] = useState([]);
  const [avgScore, setAvgScore] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScoreData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(url + "/db_detailed_score",{"username" : username, "id" : video_id}, { responseType: 'json', ...options });

        console.log(response.data)
        console.log(response.data.avgScores.right_shoulder)
        setScore(scores => [
          ...scores, 
          
          {"left_shoulder": response.data.detailed_scores.left_shoulder},
          {"left_elbow" : response.data.detailed_scores.left_elbow},
          {"right_shoulder": response.data.detailed_scores.right_shoulder},
          {"right_elbow": response.data.detailed_scores.right_elbow},
          {"left_hip": response.data.detailed_scores.left_hip},
          {"left_knee": response.data.detailed_scores.left_knee},
          {"right_hip": response.data.detailed_scores.right_hip},
          {"right_knee": response.data.detailed_scores.right_knee},
          {"total_score": response.data.avgScores.total_score},
        ]);

        setAvgScore(avgScores => [
          ...avgScores,
          {"avg_score_over_time" : response.data.detailed_scores.avg_score_over_time},
          {"left_shoulder": response.data.avgScores.left_shoulder},
          {"left_elbow" : response.data.avgScores.left_elbow},
          {"right_shoulder": response.data.avgScores.right_shoulder},
          {"right_elbow": response.data.avgScores.right_elbow},
          {"left_hip": response.data.avgScores.left_hip},
          {"left_knee": response.data.avgScores.left_knee},
          {"right_hip": response.data.avgScores.right_hip},
          {"right_knee": response.data.avgScores.right_knee},
          
        ])
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScoreData();
  }, []);

  return { score, isLoading, error, avgScore  };
};

export default useDbDetailedScore;
