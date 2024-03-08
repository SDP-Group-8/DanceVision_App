import useFetchImages from "../../hooks/useFetchImages";
import styles from "./SelectVideoPage.module.css";

import VideoDisplay from "../../components/VideoDisplay/VideoDisplay";

const Loader = ({message}) => {
  return (<div className={styles.SelectVideoPage}><h1 style={{zIndex: 1}}>{message}</h1><div className={styles.gradient}></div></div>)
}

function SelectVideoPage() {
    const { images, isLoading, error } = useFetchImages(import.meta.env.VITE_API_URL);

    console.log(images)

    if (isLoading) {
      return <Loader message={"Loading Images..."}/>;
    }
  
    if (error) {
      return <Loader message={`Error fetching images: ${error.message}`}/>;
    }

    return (
      <div className={styles.SelectVideoPage}>
        
        <h1 className={styles.header}>Select A Dance Video</h1>
        <div className={styles["thumbnail-container"]}>
          {images.map((image) => 
            <VideoDisplay 
              key={image.basename}
              imgUrl={image.thumbnail_filename}
              title={image.basename}
              videoName={image.video_filename}
            />)}
            
        </div>
        <div className={styles.gradient}></div>
        
       
      </div>
    );
}


export default SelectVideoPage;