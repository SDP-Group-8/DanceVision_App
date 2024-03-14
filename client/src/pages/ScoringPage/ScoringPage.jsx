import React from "react";
import useDetailedScore from "../../hooks/useDetailedScore";
import styles from "./ScoringPage.module.css";
import useUserVideo from "../../hooks/useUserVideo";
import UserVideoAndTotalScore from "../../components/UserVideoAndTotalScore/UserVideoAndTotalScore";
import AvgScores from "../../components/AvgScores/AvgScores";
import DetailedGraphs from "../../components/DetailedGraphs/DetailedGraphs";

const ScoringPage = () => {
  const { score, isLoading, error, avgScore } = useDetailedScore(
    import.meta.env.VITE_API_URL
  );
  console.log("In scoring page", score);
  console.log(avgScore);

  const { videoBlob, videoLoading, videoError } = useUserVideo(
    import.meta.env.VITE_API_URL
  );
  console.log("Video blob in scoring page", videoBlob);

  if (isLoading) {
    console.log(isLoading);
    return <p>Loading images...</p>;
  } else if (error) {
    return <p>Error fetching scores: {error.message}</p>;
  } else if (score.length > 0) {
    return (
      <div
        className={styles.container}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0px",
        }}
      >
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
