import axios from 'axios';
import { useState, useEffect} from 'react';

const useDetailedScore = (url, options = {}) => {
  const [score, setScore] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScoreData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(url + "/detailed_scores", { responseType: 'json', ...options });
        const r_shoulder_l_shoulder_l_elbow = response.data.r_shoulder_l_shoulder_l_elbow;
        console.log(r_shoulder_l_shoulder_l_elbow);
        setScore(scores => [
          ...scores, 
          {"total_score": response.data.total_score},
          {"r_shoulder_l_shoulder_l_elbow": response.data.r_shoulder_l_shoulder_l_elbow},
          {"l_shoulder_l_elbow_l_wrist" : response.data.l_shoulder_l_elbow_l_wrist},
          {"l_shoulder_r_shoulder_r_elbow": response.data.l_shoulder_r_shoulder_r_elbow},
          {"r_shoulder_r_elbow_r_wrist": response.data.r_shoulder_r_elbow_r_wrist},
          {"r_hip_l_hip_l_knee": response.data.r_hip_l_hip_l_knee},
          {"l_hip_l_knee_l_ankle": response.data.l_hip_l_knee_l_ankle},
          {"l_hip_r_hip_r_knee": response.data.l_hip_r_hip_r_knee},
          {"r_hip_r_knee_r_ankle": response.data.r_hip_r_knee_r_ankle}
        ]);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScoreData();
  }, []);

  return { score, isLoading, error  };
};

export default useDetailedScore;
