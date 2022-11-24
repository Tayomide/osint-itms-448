import { useState, useEffect } from 'react'
import styled from "styled-components"

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
    <Container className="chart">
      {data &&
      <>
        <Bar className="desktop" options={{...CommitGraph.getOptions(), maintainAspectRatio : false}} data={data} />
        <Bar className="mobile" options={{...CommitGraph.getOptions(), indexAxis: 'y', maintainAspectRatio : false}} data={data} />
      </>
      }
    </Container>
    )
}

const Container = styled.div`
  .mobile{
    display: none!important;
  }
  .desktop{
    display: block!important;
  }
  @media screen and (max-width: 380px){
    .mobile{
      display: block!important;
    }
    .desktop{
      display: none!important;
    }
  }
`