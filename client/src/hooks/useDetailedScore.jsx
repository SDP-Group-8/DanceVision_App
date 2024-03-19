import axios from 'axios';
import { useState, useEffect} from 'react';

const useDetailedScore = (url, options = {}) => {
  const [score, setScore] = useState([]);
  const [avgScore, setAvgScore] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScoreData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(url + "/detailed_scores", { responseType: 'json', ...options });
        // const r_shoulder_l_shoulder_l_elbow = response.data.r_shoulder_l_shoulder_l_elbow;
        // console.log(r_shoulder_l_shoulder_l_elbow);
        setScore(scores => [
          ...scores, 
          
          {"left_shoulder": response.data.left_shoulder},
          {"left_elbow" : response.data.left_elbow},
          {"right_shoulder": response.data.right_shoulder},
          {"right_elbow": response.data.right_elbow},
          {"left_hip": response.data.left_hip},
          {"left_knee": response.data.left_knee},
          {"right_hip": response.data.right_hip},
          {"right_knee": response.data.right_knee},
          {"total_score": response.data.total_score},
        ]);

        setAvgScore(avgScores => [
          ...avgScores,
          {"avg_score_over_time" : response.data.avg_score_over_time},
          {"left_shoulder": response.data.left_shoulder},
          {"left_elbow" : response.data.left_elbow},
          {"right_shoulder": response.data.right_shoulder},
          {"right_elbow": response.data.right_elbow},
          {"left_hip": response.data.left_hip},
          {"left_knee": response.data.left_knee},
          {"right_hip": response.data.right_hip},
          {"right_knee": response.data.right_knee},
          
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

export default useDetailedScore;
