import styled from "styled-components"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Home } from "./Pages/Home"
import { GithubUser } from "./Pages/GithubUser";

const App = () => {
  return (
    <Container>
      <Router>
        <Routes>
          <Route exact path="/" element={ <Home /> } />
          <Route exact path="/github/:user" element={ <GithubUser /> } />
        </Routes>
      </Router>
    </Container>
  );
}

export default App;

const Container = styled.div``