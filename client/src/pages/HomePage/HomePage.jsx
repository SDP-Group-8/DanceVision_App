import { UploadButton } from "../../components/UploadButton";
import { SeeVideosButton } from "../../components/SeeVideosButton";

import styles from './HomePage.module.css'
import logo from '../../assets/logo.png'

const HomePage = () => {
    return(
        <div className={styles.HomePage}>
            <img className={styles.logo} src={logo} alt="logo" />
            <h1>Welcome to DanceVision</h1>
            <div className={styles["button-container"]}>
                <SeeVideosButton/>
                <p>or</p>
                <UploadButton></UploadButton>
            </div>
            
            <div className={styles.background}></div>
        </div>
    )
}

export default HomePage;