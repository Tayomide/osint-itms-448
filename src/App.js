import styled from "styled-components"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Home } from "./Pages/Home"
import { GithubUser } from "./Pages/GithubUser";
import { Github } from "./Pages/Github";
import { GithubCompare } from "./Pages/GithubCompare";

const App = () => {
  return (
    <Container>
      <Router>
        <Routes>
          <Route exact path="/" element={ <Home /> } />
          <Route exact path="/github" element={ <Github />} />
          <Route exact path="/github/:user" element={ <GithubUser /> } />
          <Route exact path="github/compare" element={ <GithubCompare />} />
        </Routes>
      </Router>
    </Container>
  );
}

export default App;

const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`