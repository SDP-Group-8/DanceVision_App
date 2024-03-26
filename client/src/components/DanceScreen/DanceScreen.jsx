import useVideoFeed from '../../hooks/useVideoFeed';
import styles from './DanceScreen.module.css';
import TimeLine from '../TimeLine.jsx'

import { useLocation, useNavigate } from 'react-router-dom';
import React, {useRef, useEffect, useState} from 'react'
import CustomStepper from '../CustomStepper.jsx';
import usePeerConnection from '../../hooks/usePeerConnection.jsx';
import useReferenceVideo from '../../hooks/useReferenceVideo.jsx';
import ScoreBar from '../ScoreBar/ScoreBar.jsx'
import axios from 'axios';

let initial = false

function DanceScreen(props) {
  const { state } = useLocation();
  const navigate = useNavigate()
  const [id, setId] = useState();

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

  
  useEffect(() => {
  const fetchId = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/detailed_scores", { responseType: 'json' });  
      setId(response.data.id)
      if(id){
        navigate(`/scoring?id=${id}`)
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