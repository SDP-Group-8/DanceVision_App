import useVideoFeed from '../../hooks/useVideoFeed';
import styles from './DanceScreen.module.css';
import { CountdownDonut } from "../../components/CountdownDonut";
import ScoringPage from '../../pages/ScoringPage/ScoringPage.jsx';

import { useLocation, useNavigation } from 'react-router-dom';
import React, {useRef, useEffect} from 'react'

function DanceScreen(props) {
  const { state } = useLocation();

  const {liveVideoSource, recordedVideoSource, isVideoAvailable, isConnectionClosed, recordingDate} 
    = useVideoFeed(import.meta.env.VITE_API_URL, state.basename, state.videoName);
  const [show, setShow] = React.useState(false)

  const liveVideos = useRef(new MediaStream())
  const recordedVideos = useRef(new MediaStream())

  liveVideos.current.srcObject = liveVideoSource;
  recordedVideos.current.srcObject = recordedVideoSource;

  return isConnectionClosed ? <ScoringPage basename={state.basename} datetime={recordingDate} />
    : (
      <div>
        <video ref={liveVideos} autoPlay width="100%"></video>
        <video ref={recordedVideos} autoPlay width="100%"></video>
      </div>
    );
}

export default DanceScreen;