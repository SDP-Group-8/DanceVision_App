import { Link } from "react-router-dom";

import styles from './SeeVideosButton.module.css'

function SeeVideosButton() {

    return (
        <Link to="/videos">
            <button className={styles.button}>
                Select a video
            </button>
        </Link>  
    )
}

export default SeeVideosButton;