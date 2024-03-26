import useVideoFeed from '../../hooks/useVideoFeed';
import styles from './DanceScreen.module.css';
import ScoringPage from '../../pages/ScoringPage/ScoringPage.jsx';
import TimeLine from '../TimeLine.jsx'

import { useLocation } from 'react-router-dom';
import React, {useRef, useState} from 'react'
import CustomStepper from '../CustomStepper.jsx';
import ScoreBar from '../ScoreBar/ScoreBar.jsx';
import usePeerConnection from '../../hooks/usePeerConnection.jsx';
import useReferenceVideo from '../../hooks/useReferenceVideo.jsx';
import CountdownDonut from '../CountdownDonut/CountdownDonut.jsx';

let initial = false

function DanceScreen(props) {
  const [ started, setStarted ] = useState(false)
  const countdown = 6;
  const { state } = useLocation();

  const [videoDuration, setVideoDuration] = useState(0);
  const options = {videoName: state.videoName, basename: state.basename}
  let {peerConnection, recordingDate, scoreChannel} = usePeerConnection(import.meta.env.VITE_API_URL, !initial, options)
  initial = true
  const {liveVideoSource, isConnectionClosed} = useVideoFeed(peerConnection);
  const {recordedVideoSource} = useReferenceVideo(peerConnection)

  const liveVideos = useRef(new MediaStream())
  const recordedVideos = useRef(new MediaStream())

  liveVideos.current.srcObject = liveVideoSource;
  recordedVideos.current.srcObject = recordedVideoSource;

  setTimeout(() => {
    setStarted(true)
  }, countdown * 1000)

  if(!started){
    return <CountdownDonut initialSeconds={countdown}/>
  }else if(isConnectionClosed){
    return <ScoringPage basename={state.basename} datetime={recordingDate} /> 
  }else{
    return (
    <div className={styles.danceScreen}>
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
        <ScoreBar scoreChannel={scoreChannel}></ScoreBar>
      
      </div>
      <div className={styles.timeline}>
        {videoDuration > 0 && <TimeLine duration={videoDuration}/>}
        
      </div>
      <div className={styles.gradient}></div>
      
    </div>
    )
  }
}

export default DanceScreen;
