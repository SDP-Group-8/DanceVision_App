import styles from "./VideoDisplay.module.css"


const VideoDisplay = ({imgUrl, title}) => {
  const url = import.meta.env.VITE_APP_BACKEND_URL + "/thumbnail";
  let cleanTitle = title.replace(/\.jpg$/, '');
  cleanTitle = cleanTitle.replace(url, '');
  cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)
  return(
  <div className={styles["video-display"]} onClick={() => console.log("hello")}>
    <img className={styles.thumbnail} src={imgUrl} alt="thumbnail"/>
    <div className={styles["title-wrapper"]}>
      {cleanTitle}
    </div>
  </div>
  )
}
export default VideoDisplay;