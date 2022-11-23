import styled from "styled-components"

export const HeaderLoading = () => {
  return (
    <Container>
      <li className="header">
        <div className="first"></div>
        <div className="second"></div>
        <div className="third"></div>
        <div className="fourth"></div>
        <div className="fifth"></div>
        <div className="sixth"></div>
      </li>
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
  background: #f6f7f8;
  background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
  background-size: 1000px 104px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: max-content;
  overflow-x: scroll;
  width: 100%;
  >li{
    display: flex;
    flex-direction: row;
    .first{
      background-color: #ffffff;
      width: 1em;
      height: 60px;
    }
    .second{
      background-color: transparent;
      height: 40px;
      width: 40px;
      margin-top: 10px;
      margin-right: 10px;
      box-shadow: 0 0 0 10px white;
    }
    .third{
      background-color: #ffffff;
      height: 5px;
      width: 115px;
      margin-top: 35px;
      box-shadow: 0 0 0 0 white;
    }
  }
`