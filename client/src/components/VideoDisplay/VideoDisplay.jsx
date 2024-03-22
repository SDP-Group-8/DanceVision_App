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
    navigate("/countdown", { state: {basename: basename, videoName: videoName }} )
  }

  return(
      <div className={styles["video-display"]}>
        
          <img className={styles.thumbnail} src={url + imgUrl} alt="thumbnail" />
          <div onClick={handleClick} className={styles["title-wrapper"]}>
            {cleanTitle}
          </div>
       
      </div>
    
  )
}
export default VideoDisplay;