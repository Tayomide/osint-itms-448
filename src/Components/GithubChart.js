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

export const GithubChart = ({user}) => {

  const CommitGraph = require("../Chart/GithubCommitChart")
  console.log("I was meant to be yours.")
  const [data, setData] = useState(null)
  useEffect(() => {
    console.log("rerender")
    CommitGraph.getData(user)
    .then(response => setData(response))
  }, [CommitGraph, user])
  
  
  return (
    <div className="chart">
      {data &&<Bar options={CommitGraph.getOptions()} data={data} />}
    </div>
    )
}