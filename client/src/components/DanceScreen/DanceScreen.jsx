import useVideoFeed from '../../hooks/useVideoFeed';
import styles from './DanceScreen.module.css';
import { CountdownDonut } from "../../components/CountdownDonut";
import ScoringPage from '../../pages/ScoringPage/ScoringPage.jsx';

import { useLocation, useNavigate } from 'react-router-dom';
import React, {useRef, useEffect, useState} from 'react'

function DanceScreen(props) {
  const { state } = useLocation();
  const navigate = useNavigate()
  const [id, setId] = useState();

  const {liveVideoSource, recordedVideoSource, isVideoAvailable, isConnectionClosed, recordingDate} 
    = useVideoFeed(import.meta.env.VITE_API_URL, state.basename, state.videoName);
  const [show, setShow] = React.useState(false)

  const liveVideos = useRef(new MediaStream())
  const recordedVideos = useRef(new MediaStream())

  liveVideos.current.srcObject = liveVideoSource;
  recordedVideos.current.srcObject = recordedVideoSource;

  if (isConnectionClosed){
    useEffect(() => {
    const fetchId = async () => {
      try {
        const response = await axios.get(url + "/dance_id", { responseType: 'json', ...options });  
        setId(response.data.id)
        if(id){
          navigate(`/scoring?id=${id}`)
        }else{
          console.log("Error fetch dance Id")
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchId();
  }, []);
  }else{
    return (
      <div>
        <video ref={liveVideos} autoPlay width="100%"></video>
        <video ref={recordedVideos} autoPlay width="100%"></video>
      </div>
    )
  }

  // return isConnectionClosed ? <ScoringPage basename={state.basename} datetime={recordingDate} />
  //   : (
  //     <div>
  //       <video ref={liveVideos} autoPlay width="100%"></video>
  //       <video ref={recordedVideos} autoPlay width="100%"></video>
  //     </div>
  //   );
}

export default DanceScreen;