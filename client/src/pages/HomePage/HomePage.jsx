import { UploadButton } from "../../components/UploadButton";
import { SeeVideosButton } from "../../components/SeeVideosButton";

import styles from './HomePage.module.css'

const HomePage = () => {
    return(
        <div className={styles.HomePage}>
            <h1>Welcome to DanceVision</h1>
            <SeeVideosButton/>
            <p> Or</p>
            <UploadButton></UploadButton>
            <div className={styles.background}></div>
        </div>
    )
}

export default HomePage;