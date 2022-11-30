import styled from "styled-components"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
// import { Home } from "./Pages/Home"
import { GithubOrg } from "./Pages/GithubOrg";
import { GithubUser } from "./Pages/GithubUser";
import { Github } from "./Pages/Github";
import { GithubCompare } from "./Pages/GithubCompare";
import { Navbar } from "./Pages/Navbar";
import { DarkLightContext } from "./Components/DarkLightContext";
import { useState, useEffect } from "react"
const App = () => {
  if(localStorage["GithubUser"] && JSON.parse(localStorage["GithubUser"]).length > 0 && !JSON.parse(localStorage["GithubUser"])[0]["__typename"])localStorage.removeItem("GithubUser")
  const [mode, setMode] = useState(localStorage["mode"]? localStorage["mode"]:"light")
  useEffect(() => {
    localStorage["mode"] = mode
  }, [mode])

  return (
    <DarkLightContext.Provider value={{mode, setMode}}>
      <Container className={mode}>
        <Router>
          <Navbar />
          <Routes>
            <Route exact path="/" element={ <Github /> } />
            <Route exact path="/github" element={ <Github />} />
            <Route exact path="/github/:user" element={ <GithubUser /> } />
            <Route exact path="github/compare" element={ <GithubCompare />} />
            <Route exact path="github/org/:org" element={ <GithubOrg />} />
          </Routes>
        </Router>
      </Container>
    </DarkLightContext.Provider>
  );
}

export default App;

const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  @media screen and (max-width: 1000px) {
    flex-direction: column;
  }
  @media screen and (max-width: 1000px) {
    height: max-content;
    min-height: 100%;
  }
  &.light{
    --main-bg-color: #42A5F5;
    --secondary-bg-color: #69B7F7;
    --main-color: #F8F8F8;
    --default-color: white;
    --header-color: #161656;
  }
  &.dark{
    --main-bg-color: #0b4558;
    --secondary-bg-color: #06283d;
    --main-color: #256d85;
    --default-color: #06283d;
    --header-color: white;
    background-color: #06283d;
    color: white;
    /* #0b4558 */
  }
  
`