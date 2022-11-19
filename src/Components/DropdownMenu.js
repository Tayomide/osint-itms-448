import React from 'react'
import styled from 'styled-components'
import { useState } from "react"

export const DropdownMenu = ({type, setType, list}) => {
  const [updateChart, setUpdateChart] = useState(false)
  const updateType = (type) => {
    setUpdateChart(false)
    setType(type)
  }
  return (
    <Container className="dropdown" onClick={() => setUpdateChart(!updateChart)} tabIndex="1" onBlur={() => setUpdateChart(false)}>
      <p>{type}</p>
      <button></button>
      {updateChart && 
        <ul>
          {list.map((type, idx) => <li key={idx} onClick={() => updateType(type)}><p>{type}</p></li>)}
        </ul>
      }
    </Container>
  )
}

const Container = styled.div`
  align-items: center;
  background-color: #efefef;
  border-radius: 0.2em 0.2em 0.2em 0.2em;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  height: 2.3em;
  justify-content: space-between;
  padding: 0 1em;
  position: relative;
  width: 10em;
  ul{
    background-color: inherit;
    border-radius: 0.2em 0.2em 0.2em 0.2em;
    height: max-content;
    position: absolute;
    left: 0;
    right: 0;
    top: 3em;
    li{
      cursor: pointer;
      display: flex;
      align-items: center;
      height: 2.3em!important;
      p{
        padding: 0 0 0 1em;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }
      :hover{
        background-color: #d4d3d3;
      }
    }
  }
  p{
    height: max-content;
    text-transform: capitalize;
  }
  button {
    width: 0.8em;
    height: 0.5em!important;
    background-color: black;
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
  }
`