import useVideoFeed from '../../hooks/useVideoFeed';
import styles from './DanceScreen.module.css';
import { CountdownDonut } from "../../components/CountdownDonut";

import React, {useRef} from 'react'

const DanceScreen = (props) => {
  const {liveVideoSource, recordedVideoSource, isVideoAvailable} = useVideoFeed(import.meta.env.VITE_API_URL);
  const [show, setShow] = React.useState(false)

  const liveVideos = useRef(new MediaStream())
  const recordedVideos = useRef(new MediaStream())

  liveVideos.current.srcObject = liveVideoSource;
  recordedVideos.current.srcObject = recordedVideoSource;

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true)
    }, 20000)

    return () => clearTimeout(timeout)

  }, [show])

  if (!show) return <CountdownDonut initialSeconds={10}/>;

  return (
    <div>
      <video ref={liveVideos} autoPlay width="100%"></video>
      <video ref={recordedVideos} autoPlay width="100%"></video>
    </div>
  );
}

export default DanceScreen;