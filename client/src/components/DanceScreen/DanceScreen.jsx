import useVideoFeed from '../../hooks/useVideoFeed';
import styles from './DanceScreen.module.css';
import TimeLine from '../TimeLine.jsx'

import { useLocation, useNavigate } from 'react-router-dom';
import React, {useRef, useEffect, useState} from 'react'
import CustomStepper from '../CustomStepper.jsx';
import usePeerConnection from '../../hooks/usePeerConnection.jsx';
import useReferenceVideo from '../../hooks/useReferenceVideo.jsx';
import CountdownDonut from '../CountdownDonut/CountdownDonut.jsx';
import ScoreBar from '../ScoreBar/ScoreBar.jsx'
import axios from 'axios';
import { getUserInfo } from '../../utils/localstorage.jsx';

let initial = false

function DanceScreen(props) {
  const [ started, setStarted ] = useState(false)
  const countdown = 6;
  const { state } = useLocation();
  const navigate = useNavigate()

  const [videoDuration, setVideoDuration] = useState(0);
  const options = {videoName: state.videoName, basename: state.basename}
  let {peerConnection, recordingDate, scoreChannel} = usePeerConnection(import.meta.env.VITE_API_URL, !initial, options)
  initial = true
  const {liveVideoSource, isConnectionClosed} = useVideoFeed(peerConnection);
  const {recordedVideoSource} = useReferenceVideo(peerConnection)

  const username = getUserInfo()

  const liveVideos = useRef(new MediaStream())
  const recordedVideos = useRef(new MediaStream())

  liveVideos.current.srcObject = liveVideoSource;
  recordedVideos.current.srcObject = recordedVideoSource;

  useEffect(() => {
    const fetchId = async () => {
    try {
      const params = new URLSearchParams({"username": username})
      const response = await axios.get(import.meta.env.VITE_API_URL + "/detailed_scores?" + params, { responseType: 'json' });  
      if(response.data.id){
        navigate(`/scoring?id=${response.data.id}`)
      }else{
        console.log("Error fetch dance Id")
      }
      } catch (error) {
        console.error(error)
      }
    };
    if (isConnectionClosed){
      fetchId();
    }
  }, [isConnectionClosed]);

  setTimeout(() => {
    setStarted(true)
  }, countdown * 1000)

  if(!started){
    return <CountdownDonut initialSeconds={countdown}/>
  }
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

export default DanceScreen;
