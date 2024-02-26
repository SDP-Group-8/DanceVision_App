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
        const shoulderScore = response.data.shoulder;
        console.log(shoulderScore);
        setScore(shoulderScore);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScoreData();
  }, []);

  // const revokeImageUrls = () => {
  //   images.forEach((image) => URL.revokeObjectURL(image.url));
  // };

  // // Cleanup function to avoid memory leaks
  // useEffect(() => () => revokeImageUrls(), [images]);
  return { score, isLoading, error  };
};

export default useDetailedScore;
