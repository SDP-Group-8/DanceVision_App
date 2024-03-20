import styles from "./VideoDisplay.module.css"
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';

const VideoDisplay = ({imgUrl, title, basename, videoName}) => {
  const url = import.meta.env.VITE_API_URL + "/thumbnails/"
  let cleanTitle = title.replace(/\.jpg$/, '');
  cleanTitle = cleanTitle.replace(url, '');
  cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)
  
  let navigate = useNavigate()

  const handleClick = async (e) => {
    e.preventDefault()
    navigate("/live_comparison", { state: {basename: basename, videoName: videoName }} )
  }

  return(
      <div className={styles["video-display"]}>
        <Link onClick={handleClick}>
          <img className={styles.thumbnail} src={url + imgUrl} alt="thumbnail" />
          <div className={styles["title-wrapper"]}>
            {cleanTitle}
          </div>
        </Link>
      </div>
    
  )
}
export default VideoDisplay;