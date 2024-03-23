import useVideoFeed from '../../hooks/useVideoFeed';
import styles from './DanceScreen.module.css';
import ScoringPage from '../../pages/ScoringPage/ScoringPage.jsx';
import LiveScore from '../LiveScore/LiveScore';
import TimeLine from '../TimeLine.jsx'

import { useLocation } from 'react-router-dom';
import React, {useRef, useState} from 'react'
import CustomStepper from '../CustomStepper.jsx';
import ScoreBar from '../ScoreBar/ScoreBar.jsx';
import usePeerConnection from '../../hooks/usePeerConnection.jsx';

function DanceScreen(props) {
  const { state } = useLocation();

  const [videoDuration, setVideoDuration] = useState(0);
  const options = {basename: state.basename, videoName: state.videoName}
  const {peerConnection, recordingDate} = usePeerConnection(import.meta.env.VITE_API_URL, true, options)
  const {liveVideoSource, recordedVideoSource, isConnectionClosed} = useVideoFeed(peerConnection);

  const liveVideos = useRef(new MediaStream())
  const recordedVideos = useRef(new MediaStream())

  liveVideos.current.srcObject = liveVideoSource;
  recordedVideos.current.srcObject = recordedVideoSource;

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
        <ScoreBar></ScoreBar>
      
      </div>
      <div className={styles.timeline}>
        {videoDuration > 0 && <TimeLine duration={videoDuration}/>}
        
      </div>
      <div className={styles.gradient}></div>
      
    </div>

  );
}

export default DanceScreen;