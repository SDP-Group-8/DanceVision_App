import React from "react";
import useDetailedScore from "../../hooks/useDetailedScore";
import CustomStepper from "../../components/CustomStepper";
import styles from "./ScoringPage.module.css";
import useUserVideo from "../../hooks/useUserVideo";
import UserVideoAndTotalScore from "../../components/UserVideoAndTotalScore/UserVideoAndTotalScore";
import AvgScores from "../../components/AvgScores/AvgScores";
import DetailedGraphs from "../../components/DetailedGraphs/DetailedGraphs";
import useDbDetailedScore from "../../hooks/useDbDetailedScore";
import { getUserInfo } from "../../utils/localstorage";
import { useLocation } from "react-router-dom";


const ScoringPage = (basename, datetime) => {
  // const { score, isLoading, error, avgScore } = useDetailedScore(
  //   import.meta.env.VITE_API_URL
  // );
  const location = useLocation();
  const video_id = new URLSearchParams(location.search).get("id");
  console.log(video_id);
  const username = getUserInfo()

  const { score, isLoading, error, avgScore } = useDbDetailedScore(
    import.meta.env.VITE_API_URL, username, video_id
  );

  


  const { videoBlob, videoLoading, videoError } = useUserVideo(
    import.meta.env.VITE_API_URL, basename, datetime
  );

  if (isLoading) {
    return <p>Loading images...</p>;
  } else if (error) {
    return <p>Error fetching scores: {error.message}</p>;
  } else if (score.length > 0) {
    return (
      <div
        className={styles.container}

      >
        <div className={styles.stepper}>
          <CustomStepper stepIndex={2} color="black" />
        </div>
        
        {videoBlob && (
          <UserVideoAndTotalScore
            videoBlob={videoBlob}
            value={67}
          ></UserVideoAndTotalScore>
        )}
        {avgScore && <AvgScores avgScore={avgScore}></AvgScores>}
        {score && <DetailedGraphs score={score}></DetailedGraphs>}
        
      </div>
    );
  }
};

export default ScoringPage;
