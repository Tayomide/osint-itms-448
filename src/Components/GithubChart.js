import { useState, useEffect } from 'react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const GithubChart = ({user, type}) => {
  const CommitGraph = require("../Chart/GithubCommitChart")
  const [data, setData] = useState(null)
  useEffect(() => {
    CommitGraph.getData(user, type)
    .then(response => setData(response))
  }, [CommitGraph, user, type])
  
  
  return (
    <div className="chart">
      {data &&<Bar options={CommitGraph.getOptions()} data={data} />}
    </div>
    )
}