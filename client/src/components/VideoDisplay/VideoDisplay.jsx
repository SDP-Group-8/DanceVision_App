import styles from "./VideoDisplay.module.css"
import {Link} from "react-router-dom";

const VideoDisplay = ({imgUrl, title}) => {
  const url = "http://localhost:8000/thumbnails/"
  let cleanTitle = title.replace(/\.jpg$/, '');
  cleanTitle = cleanTitle.replace(url, '');
  cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)
  return(
    <Link to="/live_comparison">
      <div className={styles["video-display"]}>
        <img className={styles.thumbnail} src={imgUrl} alt="thumbnail" />
        <div className={styles["title-wrapper"]}>
          {cleanTitle}
        </div>
      </div>
    </Link>
  )
}
export default VideoDisplay;