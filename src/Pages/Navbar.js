import React from 'react'
import styled from 'styled-components'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
// import GitHubIcon from '@mui/icons-material/GitHub';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <Container>
      <a href="/">
        <HomeOutlinedIcon sx={{
          width:"35px",
          height:"35px"
        }}/>
        <p>Home</p>
      </a>
      <NavLink to="/github/compare"
        className={({ isActive }) => isActive ? "active" : undefined}
        exact="true"
      >
        <CompareArrowsIcon
        sx={{
          width:"50px",
          height:"50px"
        }}
        className='github'/>
        <p>Compare</p>
      </NavLink>
    </Container>
  )
}

const Container = styled.nav`
  background-color: rgb(251 251 251);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 5em;
  padding-top: 1.3em;
  a{
    height: max-content;
    color: inherit;
    p{
      display: none;
    }
    .github{
      padding: 0.25em;
      margin-top: 1em;
      border-radius: 0.3em;
    }
  }
  .active svg{
    background-color: rgb(239 239 239);
  }
  @media screen and (max-width: 1000px) {
    width: 100vw;
    height: 3em;
    flex-direction: row;
    padding: 0;
    a{
      height: 3em;
      display: inline-flex;
      align-items: center;
      padding: 0 2em;
      svg{
        display: none;
      }
      p{
        display: block;
        height: min-content;
      }
      .github{
        margin-top: 0;
        margin-left: 1em;
      }
      :hover{
        background-color: rgb(231, 231, 231, 0.8);
      }
    }
    .active{
      background-color: rgb(231 231 231);
    }
  }
  @media screen and (max-width: 220px) {
    a{
      padding: 0;
      width: inherit;
      justify-content: center;
    }
  }
`
