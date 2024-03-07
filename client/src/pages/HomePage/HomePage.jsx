import { UploadButton } from "../../components/UploadButton";
import { SeeVideosButton } from "../../components/SeeVideosButton";
import { Popup } from "../../components/Popup";

import styles from './HomePage.module.css'
import logo from '../../assets/logo.png'
import { useState } from "react";

const HomePage = () => {
    const [showPopup, setShowPopup] = useState({success:false, error:false, show:false})
    const changePopup = (data) => {
        setShowPopup(data)
    }
    return(
        <>
            <div className={styles.HomePage}>
                <img className={styles.logo} src={logo} alt="logo" />
                <h1>Welcome to DanceVision</h1>
                <div className={styles["button-container"]}>
                    <SeeVideosButton/>
                    <p>or</p>
                    <UploadButton changePopup={changePopup}></UploadButton>
                </div>
                
                <div className={styles.background}></div>
                
            </div>
            {showPopup.show && showPopup.error && <Popup title="Failed to upload video" isSuccess={false} 
            message="Make sure to upload a ‘.mp4’ file. If error persists, check your network. It could also be our fault tho lol.">
                <button className={styles.close} onClick={() => changePopup({success:false, error:false, show:false})}>Close</button>
            </Popup>}
            {showPopup.show && showPopup.success && <Popup title="Video Uploaded!" isSuccess
            message="Video uploaded successfully. You can now select it at the “select videos” page.">
                <button className={styles.close} onClick={() => changePopup({success:false, error:false, show:false})}>Close</button>
            </Popup>}
            
        </>
        
    )
}

export default HomePage;