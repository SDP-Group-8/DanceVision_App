import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import useDetailedScore from "../../hooks/useDetailedScore";
import CustomStepper from "../../components/CustomStepper";
import styles from "./ScoringPage.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const title_map = {
  r_shoulder_l_shoulder_l_elbow: "Left Shoulder",
  l_shoulder_l_elbow_l_wrist: "Left Elbow",
  l_shoulder_r_shoulder_r_elbow: "Right Shoulder",
  r_shoulder_r_elbow_r_wrist: "Right Elbow",
  r_hip_l_hip_l_knee: "Left Hip",
  l_hip_l_knee_l_ankle: "Left Knee",
  l_hip_r_hip_r_knee: "Right Hip",
  r_hip_r_knee_r_ankle: "Right Knee",
};

const colour_map = {
  r_shoulder_l_shoulder_l_elbow : {
    bg : "rgb(53, 162, 235)",
    border : "rgba(53, 162, 235, 0.5)"
  },
  l_shoulder_l_elbow_l_wrist : {
    bg : "rgb(255, 99, 132)",
    border : "rgba(255, 99, 132, 0.5)"
  },
  l_shoulder_r_shoulder_r_elbow : {
    bg : "rgb(75, 192, 192)",
    border : "rgba(75, 192, 192, 0.5)"
  },
  r_shoulder_r_elbow_r_wrist : {
    bg : "rgb(255, 205, 86)",
    border : "rgba(255, 205, 86, 0.5)"
  },
  r_hip_l_hip_l_knee : {
    bg : "rgb(54, 162, 235)",
    border : "rgba(54, 162, 235, 0.5)"
  },
  l_hip_l_knee_l_ankle : {
    bg : "rgb(153, 102, 255)",
    border : "rgba(153, 102, 255, 0.5)"
  },
  l_hip_r_hip_r_knee : {
    bg : "rgb(255, 159, 64)",
    border : "rgba(255, 159, 64, 0.5)"
  },
  r_hip_r_knee_r_ankle : {
    bg : "rgb(255, 0, 0)",
    border : "rgba(255, 0, 0, 0.5)"
  },
  
}

function options(name) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title_map[name],
      },
    },
  };
}

// @TODO: Make this more generic and not hardcoded to specific joints. Fetch the length of the video from server and dynamically render this.
const labels = ["0", "5", "10", "15", "20"];


function generateChartData(numbers, name) {
  return {
    labels: labels,
    datasets: [
      {
        fill: true,
        label: "Score",
        data: numbers,
        borderColor: colour_map[name].bg,
        backgroundColor: colour_map[name].border
        
      },
    ],
  };
}

const ScoringPage = () => {
  const { score, isLoading, error } = useDetailedScore(
    import.meta.env.VITE_API_URL
  );
  console.log("In scoring page", score);

  if (isLoading) {
    console.log(isLoading);
    return <p>Loading images...</p>;
  } else if (error) {
    return <p>Error fetching scores: {error.message}</p>;
  } else if (score.length > 0) {
    return (
      <div className={styles.scoringPage}>
        <CustomStepper stepIndex={2}/>
        <h1 className={styles.header}>Your Scores</h1>
        <div className={styles.graph_row}>
          <div className={styles.graph_left}>
            <Line
              options={options("r_shoulder_l_shoulder_l_elbow")}
              data={generateChartData(score[0].r_shoulder_l_shoulder_l_elbow, "r_shoulder_l_shoulder_l_elbow")}
              height="300px"
              padding="0px"
            />
          </div>
          <div className={styles.graph_right}>
            <Line
              options={options("l_shoulder_l_elbow_l_wrist")}
              data={generateChartData(score[1].l_shoulder_l_elbow_l_wrist, "l_shoulder_l_elbow_l_wrist")}
              height="300px"
              padding="0px"
            />
          </div>
        </div>

        <div className={styles.graph_row}>
          <div className={styles.graph_left}>
            <Line
              options={options("l_shoulder_r_shoulder_r_elbow")}
              data={generateChartData(score[2].l_shoulder_r_shoulder_r_elbow, "l_shoulder_r_shoulder_r_elbow")}
              height="300px"
              padding="0px"
            />
          </div>
          <div className={styles.graph_right}>
            <Line
              options={options("r_shoulder_r_elbow_r_wrist")}
              data={generateChartData(score[3].r_shoulder_r_elbow_r_wrist, "r_shoulder_r_elbow_r_wrist")}
              height="300px"
              padding="0px"
            />
          </div>
        </div>

        <div className={styles.graph_row}>
          <div className={styles.graph_left}>
            <Line
              options={options("r_hip_l_hip_l_knee")}
              data={generateChartData(score[4].r_hip_l_hip_l_knee, "r_hip_l_hip_l_knee")}
              height="300px"
              padding="0px"
            />
          </div>
          <div className={styles.graph_right}>
            <Line
              options={options("l_hip_l_knee_l_ankle")}
              data={generateChartData(score[5].l_hip_l_knee_l_ankle, "l_hip_l_knee_l_ankle")}
              height="300px"
              padding="0px"
            />
          </div>
        </div>

        <div className={styles.graph_row}>
          <div className={styles.graph_left}>
            <Line
              options={options("l_hip_r_hip_r_knee")}
              data={generateChartData(score[6].l_hip_r_hip_r_knee, "l_hip_r_hip_r_knee")}
              height="300px"
              padding="0px"
            />
          </div>
          <div className={styles.graph_right}>
            <Line
              options={options("r_hip_r_knee_r_ankle")}
              data={generateChartData(score[7].r_hip_r_knee_r_ankle, "r_hip_r_knee_r_ankle")}
              height="300px"
              padding="0px"
            />
          </div>
        </div>

        
      </div>
    );
  }
};

export default ScoringPage;
