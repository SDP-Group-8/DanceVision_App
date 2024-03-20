import React from "react";
import styles from "./UserVideoAndTotalScore.module.css";
import Typewriter from "../TypeWriter";

const UserVideoAndTotalScore = ({ videoBlob, value }) => {
  const maxValue = 100;

  const val = (value / maxValue) * 100;
  const deg = (180 / 100) * val;
  console.log(videoBlob);
  return (
    <div className={styles.body}>
      <h1 className={styles.main_heading}>Scores & Analysis</h1>
      <div className={styles.para_container}>
        <p className={styles.main_paragraph}>
          "Dance into the spotlight with our cutting-edge video comparison and scoring
          algorithm, where every move counts and excellence shines!"
        </p>
      </div>
      <div className={styles.container}>
        <div>
          {videoBlob && (
            <div className={styles.videoContainer}>
              <video controls style={{ width: "100%", height: "auto" }}>
                <source src={URL.createObjectURL(videoBlob)} type="video/mp4" />
              </video>
            </div>
          )}
        </div>

        <div>
          <div className={styles.indicator}>
            <span
              className={styles.bar}
              style={{ transform: `rotate(${deg}deg)` }}
            />
            <span className={styles.result}>
              <span className={styles.value}>{value}</span>/
              <span className={styles.maxValue}>{maxValue}</span>
            </span>
          </div>
          <h1 className={styles.total_score}>Total Score</h1>
        </div>
      </div>
    </div>
  );
};

export default UserVideoAndTotalScore;
