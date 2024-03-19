import axios from 'axios';
import { useState, useEffect} from 'react';

const useUserVideo = (url, basename, datetime, options = {}) => {
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoError,setError] = useState("");
  const [videoLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserVideo = async () => {
      try {
        setIsLoading(true);
        const params = URLSearchParams({"video_name": basename, "attempt_datetime": datetime})
        const response = await axios.get(url + "/user_video?" + params);
        if (response.status === 200) {
            setVideoBlob(response.data); // Store video blob in state
        } else {
            console.error('Failed to fetch video');
        }
      } catch (error) {
        setError('Error fetching video:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserVideo();
  }, []);

  return { videoBlob, videoLoading, videoError  };
};

export default useUserVideo;
