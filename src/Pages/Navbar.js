import React from 'react'
import styled from 'styled-components'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import GitHubIcon from '@mui/icons-material/GitHub';
import { NavLink, matchPath, useLocation } from 'react-router-dom';
import { useState, useContext } from 'react';
import { useEffect } from 'react';
import { DarkLightContext } from '../Components/DarkLightContext';

export const Navbar = () => {
  const location = useLocation()
  const [show, setShow] = useState()
  const { mode, setMode} = useContext(DarkLightContext)
  useEffect(() => {
    setShow(matchPath({
      path: "/github/:id",
      exact: true,
      strict: true
    }, location.pathname) || matchPath({
      path: "/github/org/:id",
      exact: true,
      strict: true
    }, location.pathname))
  }, [location])
  return (
    <Container>
      <NavLink to=""
        activeclassname="active"
        exact="true"
        end
      >
        <HomeOutlinedIcon sx={{
          width:"50px",
          height:"50px"
        }}
        className="home"
        />
        <p>Home</p>
      </NavLink>
      <NavLink to="/github/compare"
        activeclassname="active"
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
      <button className={show && show.params.id !== "compare" ? "active" : ""} 
      onClick={() => setMode(mode === "light"? "dark":"light")}
      >
        <GitHubIcon
        sx={{
          width:"50px",
          height:"50px"
        }}
        className='github'/>
        <p>Github {mode}</p>
      </button>
    </Container>
  )
}

const Container = styled.nav`
  background-color: var(--main-bg-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 5em;
  padding-top: 1.3em;
  box-shadow: 1px 0px 4px 0px #0000004f;
  /* color: white; */
  a, button{
    height: max-content;
    color: inherit;
    p{
      display: none;
      text-transform: capitalize;
    }
    .github, .home{
      padding: 0.25em;
      margin-top: 1em;
      border-radius: 0.3em;
    }
    .home{
      margin: 0;
      /* padding: 0.3em;
      border-radius: 0.3em;
      box-shadow: 0px 2px 2px 0px #5f5f5f; */
    }
  }
  svg{
    color: white;
  }
  .active svg{
    background-color: var(--secondary-bg-color);
    box-shadow: 0px 1px 3px 0px #00000066;
  }
  @media screen and (max-width: 1000px) {
    width: 100vw;
    height: 3em;
    flex-direction: row;
    padding: 0;
    a, button{
      height: 3em;
      display: inline-flex;
      align-items: center;
      padding: 0 2em;
      font-size: inherit;
      
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
        background-color: var(--secondary-bg-color);
      }
    }
    .active{
      background-color: var(--secondary-bg-color);
    }
  }
  @media screen and (max-width: 350px) {
    flex-direction: column;
    height: max-content;
    a, button{
      width: 100%;
      height: 3em;
      justify-content: center;
    }
  }
  @media screen and (max-width: 220px) {
    a, button{
      padding: 0;
      width: inherit;
      justify-content: center;
    }
  }
`
