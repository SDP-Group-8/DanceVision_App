import useVideoFeed from '../../hooks/useVideoFeed';
import styles from './DanceScreen.module.css';

import {useRef} from 'react'

const DanceScreen = (props) => {
  const {liveVideoSource, isVideoAvailable} = useVideoFeed(import.meta.env.VITE_API_URL);

  console.log(isVideoAvailable)
  console.log(liveVideoSource)

  const videos = useRef(new MediaStream())
  videos.current.srcObject = liveVideoSource;

  return (
    <div>
      <video ref={videos} autoPlay width="100%"></video>
    </div>
  );
}

export default DanceScreen;