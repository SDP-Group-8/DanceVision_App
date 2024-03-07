import { Spinner } from '@chakra-ui/react'

import { UploadButton } from "../../components/UploadButton";
import { SeeVideosButton } from "../../components/SeeVideosButton";
import { Popup } from "../../components/Popup";

import styles from './HomePage.module.css'
import logo from '../../assets/logo.png'
import { useState } from "react";

const HomePage = () => {
    const defaultPopup = {success:false, error:false, show:false, loading:false}
    const [showPopup, setShowPopup] = useState(defaultPopup)
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
                <button className={styles.close} onClick={() => changePopup(defaultPopup)}>Close</button>
            </Popup>}
            {showPopup.show && showPopup.success && <Popup title="Video Uploaded!" isSuccess
            message="Video uploaded successfully. You can now select it at the “select videos” page.">
                <button className={styles.close} onClick={() => changePopup(defaultPopup)}>Close</button>
            </Popup>}
            {showPopup.show && showPopup.loading && <Popup displayIcon={false}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Spinner size='xl' thickness='8px'/>
                    </div>
                    </Popup>}
            
        </>
        
    )
}

export default HomePage;