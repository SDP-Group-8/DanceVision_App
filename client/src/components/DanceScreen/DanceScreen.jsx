import useVideoFeed from '../../hooks/useVideoFeed';
import styles from './DanceScreen.module.css';
import { CountdownDonut } from "../../components/CountdownDonut";
import ScoringPage from '../../pages/ScoringPage/ScoringPage.jsx';
import LiveScore from '../LiveScore/LiveScore';
import TimeLine from '../TimeLine.jsx'

import { useLocation } from 'react-router-dom';
import React, {useRef, useState} from 'react'
import CustomStepper from '../CustomStepper.jsx';

function DanceScreen(props) {
  const { state } = useLocation();

  const [videoDuration, setVideoDuration] = useState(0);
  const {liveVideoSource, recordedVideoSource, isVideoAvailable, isConnectionClosed, recordingDate} 
    = useVideoFeed(import.meta.env.VITE_API_URL, state.basename, state.videoName);
  const [show, setShow] = React.useState(false)
  const countdown = 5 // in seconds

  const liveVideos = useRef(new MediaStream())
  const recordedVideos = useRef(new MediaStream())

  liveVideos.current.srcObject = liveVideoSource;
  recordedVideos.current.srcObject = recordedVideoSource;

  const handleLoadedMetadata = (event) => {
    // Access the duration property of the video element
    setVideoDuration(Math.round(event.target.duration));
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true)
    }, countdown * 1000)

    return () => clearTimeout(timeout)

  }, [show])

  if (!show) return <CountdownDonut initialSeconds={countdown}/>;

  return (
    isConnectionClosed ? <ScoringPage basename={state.basename} datetime={recordingDate} /> 
    : <div className={styles.danceScreen}>
      <div className={styles.stepper}>

      <CustomStepper stepIndex={1}/>
      </div>
      <div className={styles.videoContainer}>
        <div className={styles.leftPanel}>
          <div className={styles.liveVideo}>
            <video ref={liveVideos} autoPlay width="100%"></video>
          </div>
          
        </div>

        <div className={styles.refVideo}>
          <video ref={recordedVideos} autoPlay width="100%" ></video>
        </div>
        <div className={styles.rightPanel}>
          <h1>Your Score</h1>  
          <LiveScore score={35}/>    
        </div>
        
      
      </div>
      <div className={styles.timeline}>
        {videoDuration > 0 && <TimeLine duration={videoDuration}/>}
        
      </div>
      <div className={styles.gradient}></div>
      
    </div>

  );
}

export default DanceScreen;