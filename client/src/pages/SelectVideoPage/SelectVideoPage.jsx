import useFetchImages from "../../hooks/useFetchImages";
import styles from "./SelectVideoPage.module.css";

import VideoDisplay from "../../components/VideoDisplay/VideoDisplay";

function SelectVideoPage() {
    const { images, isLoading, error } = useFetchImages(import.meta.env.VITE_API_URL);

    console.log(images)

    if (isLoading) {
      return <p>Loading images...</p>;
    }
  
    if (error) {
      return <p>Error fetching images: {error.message}</p>;
    }

    return (
      <div className={styles.SelectVideoPage}>
        <div className={styles.header}>Select A Dance Video</div>
        <div className={styles["thumbnail-container"]}>
          {images.map((image) => 
            <VideoDisplay 
              key={image.basename}
              imgUrl={image.thumbnail_filename}
              title={image.basename}
              videoName={image.video_filename}
            />)}
        </div>
       
      </div>
    );
}


export default SelectVideoPage;