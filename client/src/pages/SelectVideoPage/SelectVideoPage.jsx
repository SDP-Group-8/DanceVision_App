import useFetchImages from "../../hooks/useFetchImages";
import styles from "./SelectVideoPage.module.css";
import { Spinner } from '@chakra-ui/react';
import CustomStepper from "../../components/CustomStepper";

import VideoDisplay from "../../components/VideoDisplay/VideoDisplay";

const Loader = ({message, isLoading=false}) => {
  return (
  <div className={styles.SelectVideoPage}>
    {isLoading && <Spinner style={{zIndex: 1}} size='xl' thickness='8px' color='white'/>}
    {message && <h1 style={{zIndex: 1}}>{message}</h1>}
    
    <div className={styles.gradient}></div>
  </div>
    )
}

function SelectVideoPage() {
    const { images, isLoading, error } = useFetchImages(import.meta.env.VITE_API_URL);

    console.log(images)

    if (isLoading) {
      return <Loader message={"Fetching videos..."} isLoading/>;
    }
  
    if (error) {
      return <Loader message={`Error fetching videos: ${error.message}`}/>;
    }

    return (
      <div className={styles.SelectVideoPage}>
        <div className={styles.stepper}><CustomStepper stepIndex={0}/></div>
    
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