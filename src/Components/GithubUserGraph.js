import React from 'react'
import styled from 'styled-components'

export const GithubUserGraph = ({data}) => {
  const graphIntensity = ["intense-0", "intense-1", "intense-2", "intense-3", "intense-4"]
  const month = ["Jan","Feb","Mar", "Apr", "May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
  const formatContribution = (day) => {
    let date = new Date(day.date)
    return [<p key="12">{day.contributionCount} contributions on {date.getDate()} {month[date.getMonth()]}, {date.getFullYear()}</p>]
  }
  return (
    <Container>
      <p>User Commit Activity</p>
      <ul className='graph'>
        {data.map((weekCommit, idx) => weekCommit.contributionDays.map((dayCommit, id) => 
          <li key={`${idx}${id}`} className={graphIntensity[Math.ceil(dayCommit.contributionCount/10)] || "intense-4"}>
            {formatContribution(dayCommit)}
          </li>
        ))}
      </ul>
    </Container>
  )
}

const Container = styled.li`
  border: 1px solid #efefef;
  border-radius: 0.4em;
  width: max-content;
  padding: 1em;
  font-size: 1.05em;
  grid-column: -1 / -3;
  background-color: var(--main-color);
  box-shadow: 0px 1px 3px 0px #00000030;
  > p{
    padding: 0 0 0.6em 0;
    font-size: 1.1em;
    font-weight: bold;
  }
  .graph{
    display: grid;
    grid-template-rows: repeat(7, 1fr);
    grid-gap: 0.1em;
    grid-auto-flow: column;
    li{
      height: 0.625em;
      width: 0.625em;
      position: relative;
      cursor: pointer;
      p{
        display: none;
        position: absolute;
        flex-direction: row;
        width: max-content;
        font-size: 0.8em;
        padding: 0.6em 0.8em;
        left: -11.7ch;
        background-color: #e0e0e0;
        border-radius: 0.3em;
        z-index: 20;
      }
      :hover p{
        top: -3em;
        display: flex;
      }
    }
    .intense-0{
      background-color: #98cdf9;
    }
    .intense-1{
      background-color: #69b7f7;
    }
    .intense-2{
      background-color: #42a4f5;
    }
    .intense-3{
      background-color: #1a8ff0;
    }
    .intense-4{
      background-color: #0780e4;
    }
    @media screen and (max-width: 750px){
      grid-template-columns: repeat(7, 1fr);
      grid-template-rows: auto;
      grid-auto-flow: row;
      width: max-content;
    }
  }
`