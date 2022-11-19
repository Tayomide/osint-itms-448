import React from 'react'
import styled from 'styled-components'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';

export const Navbar = () => {
  return (
    <Container>
      <a href="/">
        <HomeOutlinedIcon sx={{
          width:"35px",
          height:"35px"
        }}/>
      </a>
      <a href="/github/compare">
        <GitHubIcon
        sx={{
          width:"50px",
          height:"50px"
        }}
        className='github'/>
      </a>
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
    .github{
      padding: 0.25em;
      margin-top: 1em;
      background-color: rgb(239 239 239);
      border-radius: 0.3em;
    }
  }
`
