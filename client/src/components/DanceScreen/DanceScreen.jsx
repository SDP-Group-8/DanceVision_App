import useVideoFeed from '../../hooks/useVideoFeed';
import styles from './DanceScreen.module.css';

import {useRef} from 'react'

const DanceScreen = (props) => {
  const {videoSource, isVideoAvailable} = useVideoFeed('http://localhost:8000/stream_offer');

  const videos = useRef(new MediaStream())
  videos.current.srcObject = videoSource;

  return (
    <video ref={videos} autoPlay width="100%">
    </video>
  );
}

export default DanceScreen;