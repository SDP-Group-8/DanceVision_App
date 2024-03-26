import axios from 'axios';
import { useState, useEffect} from 'react';

const useUserDanceScores = (username) => {
  const [score, setScore] = useState([]);
  

  useEffect(() => {
    const fetchScoreData = async () => {
      try {
        const params = new URLSearchParams({"username": username})
        const response = await axios.get(import.meta.env.VITE_API_URL  + "/userAllDanceScores?" + params, { responseType: 'json'});
        console.log(response.data.data)
        setScore(response.data.data)
        
      } catch (error) {
        console.log(error)
      } 
    };
    fetchScoreData();
  }, []);

  return { score };
};

export default useUserDanceScores;
