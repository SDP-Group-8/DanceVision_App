import useVideoFeed from '../../hooks/useVideoFeed';
import styles from './DanceScreen.module.css';
import { CountdownDonut } from "../../components/CountdownDonut";

import liveVid from '../../assets/sample1.mp4'
import refVid from '../../assets/sample3.mp4'

import React, {useRef, useState} from 'react'
import TimeLine from '../TimeLine';

const DanceScreen = (props) => {
  const {liveVideoSource, recordedVideoSource, isVideoAvailable} = useVideoFeed(import.meta.env.VITE_API_URL);
  const [videoDuration, setVideoDuration] = useState(0);
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
    <div className={styles.danceScreen}>
      <div className={styles.videoContainer}>
        <div className={styles.leftPanel}>
          <h1>Practice</h1>
          <div className={styles.liveVideo}>
            <video muted src={liveVid} autoPlay width="100%"></video>
          </div>
          
        </div>

        <div className={styles.refVideo}>
          <video muted onLoadedMetadata={handleLoadedMetadata} src={refVid} autoPlay width="100%" ></video>
        </div>
        <div className={styles.rightPanel}>
          <h1>Your Score</h1>      
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