import styled from "styled-components"

export const Loading = () => {
  return (
    <Container>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </Container>
  )
}

const Container = styled.ul`
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeHolderShimmer;
  animation-timing-function: linear;
  background: linear-gradient(to right, var(--main-color) 8%, #dddddd80 18%, var(--main-color) 33%);
  background-size: 1000px 104px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  height: max-content;
  overflow-x: scroll;
  width: 100%;
  margin: 0 0 0 0.4em;
  >li{
    align-content: flex-start;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: 13em;
    min-width: 25em;
    padding: 1em 0.8em 0.3em 0.8em;
    gap: 0.6em 0.4em;
    box-shadow: 0 0 0 10px var(--default-color);
  }
`