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
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import styles from "./AvgScores.module.css";
import Progress from "../Progress/Progress";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement
);

const color = "red";

const textCenter = {
  id: "textCenter",
  beforeDatasetsDraw(chart) {
    const { ctx, data } = chart;
    ctx.save();
    ctx.font = "bolder 10px sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(
      `Value: ${data.datasets[0].data[0]}`,
      chart.getDatasetMeta(0).data[0].x,
      chart.getDatasetMeta(0).data[0].y
    );
  },
};

const options = {
  responsive: true,
  maintainAspectRatio: true,
};

function generateDoughnutData(numbers) {
  return {
    datasets: [
      {
        data: numbers,
        backgroundColor: ["rgb(0, 197, 0)", "rgb(204, 223, 243)"],
        borderWidth: 2,
        radius: "40%",
      },
    ],
  };
}

function generateChartData(numbers) {
  return {
    labels: ["0", "5", "10", "15", "20"],
    datasets: [
      {
        fill: true,
        label: "Score",
        data: numbers,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };
}

function chartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
          text: "Whole body",
          font: {
            size: 20
          }
      },
    },
  };
}
const data = {
  datasets: [
    {
      data: [60, 40],
      backgroundColor: ["rgb(0, 197, 0)", "rgb(204, 223, 243)"],
      borderWidth: 2,
      radius: "40%",
    },
  ],
};

const AvgScores = (AvgScore) => {
  console.log(AvgScore.avgScore);

  return (
    <div className={styles.container}>
      <h1 className={styles.main_heading}>Your Moves, have a Glance!</h1>
      <div className={styles.para_container}>
        <p className={styles.main_paragraph}>
          Take control of your progress. Analyze key metrics such as shoulder,
          elbow, hip, and knee movements to track your progress over time.{" "}
        </p>
      </div>

      <div className={styles.chart_wrapper}>
        <div className={styles.left}>
          <div className={styles.left_up}>
            <div className={styles.progress_wrapper}>
              <Progress
                number={AvgScore.avgScore[1].avg_r_shoulder_l_shoulder_l_elbow}
                width={100}
                height={100}
                isTextShown={true}
                strokeColor={"rgb(53, 162, 235)"}
                className={styles.progress}
              ></Progress>
              <p className={styles.progress_name}>Left Shoulder</p>
            </div>
            <div className={styles.progress_wrapper}>
              <Progress
                number={AvgScore.avgScore[2].avg_l_shoulder_l_elbow_l_wrist}
                width={100}
                height={100}
                isTextShown={true}
                strokeColor={"rgb(255, 99, 132)"}
                className={styles.progress}
              ></Progress>
              <p className={styles.progress_name}>Left Elbow</p>
            </div>
            <div className={styles.progress_wrapper}>
              <Progress
                number={AvgScore.avgScore[3].avg_l_shoulder_r_shoulder_r_elbow}
                width={100}
                height={100}
                isTextShown={true}
                strokeColor={"rgb(75, 192, 192)"}
                className={styles.progress}
              ></Progress>
              <p className={styles.progress_name}>Right Shoulder</p>
            </div>
            <div className={styles.progress_wrapper}>
              <Progress
                number={AvgScore.avgScore[4].avg_r_shoulder_r_elbow_r_wrist}
                width={100}
                height={100}
                isTextShown={true}
                strokeColor={"rgb(255, 205, 86)"}
                className={styles.progress}
              ></Progress>
              <p className={styles.progress_name}>Right Elbow</p>
            </div>
          </div>

          <div className={styles.left_down}>
            <div className={styles.progress_wrapper}>
              <Progress
                number={AvgScore.avgScore[5].avg_r_hip_l_hip_l_knee}
                width={100}
                height={100}
                isTextShown={true}
                strokeColor={"rgb(54, 162, 235)"}
                className={styles.progress}
              ></Progress>
              <p className={styles.progress_name}>Left Hip</p>
            </div>

            <div className={styles.progress_wrapper}>
              <Progress
                number={AvgScore.avgScore[6].avg_l_hip_l_knee_l_ankle}
                width={100}
                height={100}
                isTextShown={true}
                strokeColor={"rgb(153, 102, 255)"}
                className={styles.progress}
              ></Progress>
              <p className={styles.progress_name}>Left Knee</p>
            </div>
            <div className={styles.progress_wrapper}>
              <Progress
                number={AvgScore.avgScore[7].avg_l_hip_r_hip_r_knee}
                width={100}
                height={100}
                isTextShown={true}
                strokeColor={"rgb(255, 159, 64)"}
                className={styles.progress}
              ></Progress>
              <p className={styles.progress_name}>Right Hip</p>
            </div>
            <div className={styles.progress_wrapper}>
              <Progress
                number={AvgScore.avgScore[8].avg_r_hip_r_knee_r_ankle}
                width={100}
                height={100}
                isTextShown={true}
                strokeColor={"rgb(255, 0, 0)"}
                className={styles.progress}
              ></Progress>
              <p className={styles.progress_name}>Right Knee</p>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          {/* <h1 className={styles.graph_heading}>Accuracy over time</h1> */}
          <Line
            options={chartOptions()}
            data={generateChartData(AvgScore.avgScore[0].avg_score_over_time)}
            className={styles.line_chart}
          />
          <h2 className={styles.graph_heading}>Overall Accuracy over time</h2>
        </div>
      </div>
    </div>
  );
};

export default AvgScores;
