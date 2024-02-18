import useVideoFeed from '../../hooks/useVideoFeed';
import styles from './DanceScreen.module.css';

import {useRef} from 'react'

const DanceScreen = (props) => {
  const {videoSource, isVideoAvailable} = useVideoFeed(import.meta.env.VITE_API_URL);

  const videos = useRef(new MediaStream())
  videos.current.srcObject = videoSource;

  return (
    <div>
      <video ref={videos} autoPlay width="100%"></video>
    </div>
  );
}

export default DanceScreen;