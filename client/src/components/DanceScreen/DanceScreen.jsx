import useVideoFeed from '../../hooks/useVideoFeed';
import styles from './DanceScreen.module.css';

import {useRef} from 'react'

const DanceScreen = (props) => {
  const {liveVideoSource, recordedVideoSource, isVideoAvailable} = useVideoFeed(import.meta.env.VITE_API_URL);

  const liveVideos = useRef(new MediaStream())
  const recordedVideos = useRef(new MediaStream())

  liveVideos.current.srcObject = liveVideoSource;
  recordedVideos.current.srcObject = recordedVideoSource;

  return (
    <div>
      <video ref={liveVideos} autoPlay width="100%"></video>
      <video ref={recordedVideos} autoPlay width="100%"></video>
    </div>
  );
}

export default DanceScreen;