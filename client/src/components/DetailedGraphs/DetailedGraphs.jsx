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
import styles from "./DetailedGraphs.module.css";
import useUserVideo from "../../hooks/useUserVideo";
import UserVideoAndTotalScore from "../../components/UserVideoAndTotalScore/UserVideoAndTotalScore";
import AvgScores from "../../components/AvgScores/AvgScores";
import { useNavigate } from "react-router-dom";

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

const DetailedGraphs = (score) => {
    console.log(score)
    score = score.score

  const title_map = {
    left_shoulder: "Left Shoulder",
    left_elbow: "Left Elbow",
    right_shoulder: "Right Shoulder",
    right_elbow: "Right Elbow",
    left_hip: "Left Hip",
    left_knee: "Left Knee",
    right_hip: "Right Hip",
    right_knee: "Right Knee",
  };

  const colour_map = {
    left_shoulder: {
      bg: "rgb(53, 162, 235)",
      border: "rgba(53, 162, 235, 0.5)",
    },
    left_elbow: {
      bg: "rgb(255, 99, 132)",
      border: "rgba(255, 99, 132, 0.5)",
    },
    right_shoulder: {
      bg: "rgb(75, 192, 192)",
      border: "rgba(75, 192, 192, 0.5)",
    },
    right_elbow: {
      bg: "rgb(255, 205, 86)",
      border: "rgba(255, 205, 86, 0.5)",
    },
    left_hip: {
      bg: "rgb(54, 162, 235)",
      border: "rgba(54, 162, 235, 0.5)",
    },
    left_knee: {
      bg: "rgb(153, 102, 255)",
      border: "rgba(153, 102, 255, 0.5)",
    },
    right_hip: {
      bg: "rgb(255, 159, 64)",
      border: "rgba(255, 159, 64, 0.5)",
    },
    right_knee: {
      bg: "rgb(255, 0, 0)",
      border: "rgba(255, 0, 0, 0.5)",
    },
  };

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
          font: {
            size: 20
          }
        },
      },
    };
  }

  // @TODO: Make this more generic and not hardcoded to specific joints. Fetch the length of the video from server and dynamically render this.
  const labels = ["0", "5", "10", "15", "20"];

  function generateLabels(number){
    return Array.from({ length: number }, (_, index) => (index + 1).toString());
  }

  function generateChartData(numbers, name) {
    return {
      labels: labels,
      datasets: [
        {
          fill: true,
          label: "Score",
          data: numbers,
          borderColor: colour_map[name].bg,
          backgroundColor: colour_map[name].border,
        },
      ],
    };
  }
  const navigate = useNavigate();

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
      <h1 className={styles.main_heading}>Detailed Scores</h1>
      <div className={styles.para_container}>
        <p className={styles.main_paragraph}>
        "Welcome to our detailed scores section, where we dive deep into your performance metrics across various joints. Analyze how your joints performed over time.
        "
        </p>
      </div>
      <div className={styles.graph_row}>
        <div className={styles.graph_left}>
          <Line
            options={options("left_shoulder")}
            data={generateChartData(
              score[0].left_shoulder,
              "left_shoulder"
            )}
            height="300px"
            padding="0px"
          />
        </div>
        <div className={styles.graph_right}>
          <Line
            options={options("left_elbow")}
            data={generateChartData(
              score[1].left_elbow,
              "left_elbow"
            )}
            height="300px"
            padding="0px"
          />
        </div>
      </div>

      <div className={styles.graph_row}>
        <div className={styles.graph_left}>
          <Line
            options={options("right_shoulder")}
            data={generateChartData(
              score[2].right_shoulder,
              "right_shoulder"
            )}
            height="300px"
            padding="0px"
          />
        </div>
        <div className={styles.graph_right}>
          <Line
            options={options("right_elbow")}
            data={generateChartData(
              score[3].right_elbow,
              "right_elbow"
            )}
            height="300px"
            padding="0px"
          />
        </div>
      </div>

      <div className={styles.graph_row}>
        <div className={styles.graph_left}>
          <Line
            options={options("left_hip")}
            data={generateChartData(
              score[4].left_hip,
              "left_hip"
            )}
            height="300px"
            padding="0px"
          />
        </div>
        <div className={styles.graph_right}>
          <Line
            options={options("left_knee")}
            data={generateChartData(
              score[5].left_knee,
              "left_knee"
            )}
            height="300px"
            padding="0px"
          />
        </div>
      </div>

      <div className={styles.graph_row}>
        <div className={styles.graph_left}>
          <Line
            options={options("right_hip")}
            data={generateChartData(
              score[6].right_hip,
              "right_hip"
            )}
            height="300px"
            padding="0px"
          />
        </div>
        <div className={styles.graph_right}>
          <Line
            options={options("right_knee")}
            data={generateChartData(
              score[7].right_knee,
              "right_knee"
            )}
            height="300px"
            padding="0px"
          />
        </div>
      </div>
      <button className={styles.button} onClick={() => navigate('/home')}>Exit</button>
    </div>
  );
};

export default DetailedGraphs;
