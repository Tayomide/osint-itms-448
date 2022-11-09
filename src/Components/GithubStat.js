import styled from "styled-components"

export const GithubStat = ({stat, Icon, title}) => {
  return (
    <Container>
      <p>{title}</p>
      <p>{stat}</p>
      {/* <Icon /> */}
    </Container>
  )
}

const Container = styled.div`
  
`