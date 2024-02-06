import useFetchImages from "../../hooks/useFetchImages";
import styles from "./SelectVideoPage.module.css";

import VideoDisplay from "../../components/VideoDisplay/VideoDisplay";

function SelectVideoPage() {
    const { images, isLoading, error } = useFetchImages('http://localhost:8000/thumbnails');

    if (isLoading) {
      return <p>Loading images...</p>;
    }
  
    if (error) {
      return <p>Error fetching images: {error.message}</p>;
    }

    return (
      <div>
        <div className={styles.header}>Select A Dance Video</div>
        <div className={styles["thumbnail-container"]}>
          {images.map((image) => <VideoDisplay key={image} imgUrl={image} title={image}/>)}
        </div>
       
      </div>
    );
}


export default SelectVideoPage;