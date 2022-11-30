import React from 'react'
import styled from 'styled-components'

export const GithubUserStats = ({data}) => {
  return (
    <Container>
      <p>User Statistics</p>
      <ul>
        {
          Object.keys(data).map((key, idx) => <li key={idx}><p>{key}</p><p>{data[key]}</p></li>)
        }
      </ul>
    </Container>
  )
}

const Container = styled.li`
  border-radius: 0.4em;
  width: 100%;
  padding: 1em;
  background-color: var(--main-color);
  box-shadow: 0px 1px 3px 0px #00000030;
  > p{
    padding: 0 0 0.6em 0;
    font-size: 1.1em;
    font-weight: bold;
  }
  ul{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1em;
    li{
      border-radius: 0.4em;
      padding: 0.4em 0.7em;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      background-color: var(--default-color);
      box-shadow: 0px 1px 3px 0px #00000030;
      p{
        line-height: 1.5em;
      }
    }
    @media screen and (max-width: 400px){
      display: flex;
      flex-direction: column;
      gap: 1em;
    }
  }
`