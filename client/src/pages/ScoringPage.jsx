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

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Score for the pose-estimation",
    },
  },
};

const labels = ["0", "5", "10", "15", "20"];
const numbers = [34, 78, 66, 99, 28];
const numbers2 = [12, 48, 56, 79, 31];

function generateChartData(numbers) {
  // const numbers =  [34, 78, 66, 99, 28];
  return {
    labels: labels,
    datasets: [
      {
        fill: true,
        label: "dataset",
        data: numbers,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
}

const graphStyle = {
    width: '33.33%', /* Each graph takes 1/3 width */
    height: '300px', /* Set height as needed */
  };

const ScoringPage = () => {
  return (
    // <div>ScoringPage</div>

    <div style={{ }}>
      <div >
        <Line options={options} data={generateChartData(numbers)} />
      </div>
      <div >
        <Line options={options} data={generateChartData(numbers2)} />
      </div>
      {/* Repeat the above pattern for the remaining graphs */}
    </div>
  );
};

export default ScoringPage;
