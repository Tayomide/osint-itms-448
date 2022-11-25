import styled from "styled-components"
import { useEffect, useRef, useState } from "react"
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom"

const GithubApi = require("../API/GithubApi")

export const Github = () => {
  const [input, setInput] = useState("")
  const [display, setDisplay] = useState(false)
  const [mouse, setMouse] = useState(false)
  const [userQueryList, setUserQueryList] = useState()
  const [userNodeList, setUserNodeList] = useState(localStorage["GithubUser"] ? JSON.parse(localStorage["GithubUser"]) : [])
  const inputRef = useRef()
  const searchRef = useRef()

  useEffect(() => {
    let queryList = []
    if(input && input !== ""){
      let list = localStorage["GithubUser"] ? JSON.parse(localStorage["GithubUser"]) : []
      queryList = list.filter(i => i.login && i.login.toLowerCase().includes(input.toLowerCase()))
      if(input && queryList.length === 0)GithubApi.findAccountNodes(input)
      .then(response => response.json())
      .then(response => {
        queryList = response.data.search.nodes.filter(i => i.login && i.login.toLowerCase().includes(input.toLowerCase()))
        setUserNodeList((prevState) => [...prevState, ...response.data.search.nodes])
      })
    }
    setUserQueryList(queryList)
  }, [input])

  useEffect(() => {
    localStorage["GithubUser"] = JSON.stringify(userNodeList)
    if(input && input !== "")setUserQueryList(userNodeList.filter(i => i.login && i.login.toLowerCase().includes(input.toLowerCase())))
  }, [userNodeList, input])

  const handleInputChange = (e) => {
    if(e.target.value[e.target.value.length-1] !== " ")setInput(e.target.value)
  }

  const handleFocusChange = () => {
    setDisplay(true)
  }

  const handleBlurChange = (e) => {
    if(!mouse)setDisplay(false)
  }

  const handleMouseOut = () => {
    setMouse(false)
  }

  const handleMouseIn = () => {
    setMouse(true)
  }

  return (
    <Container onFocus={handleFocusChange} onBlur={handleBlurChange} onClick={() => inputRef.current.focus()} className={!display && "curve"}
    ref={searchRef} onMouseEnter={handleMouseIn} onMouseLeave={handleMouseOut}
    >
      <div className="title">
        <h1>OSINT GitHub Search</h1>
      </div>
      <SearchComponent>
        <SearchIcon />
        <input id="search-username" type="text" onChange={handleInputChange} value={input} ref={inputRef}/>
      </SearchComponent>
      {<ul className={display ? "": "hide"}>
        {
          ((!userQueryList || userQueryList.length === 0 ) && input && input !== "")?
            <li className="no-result">No login like "{input}" on GitHub</li> :
            input && input !== "" &&
            userQueryList.map((items, key) =>
              <li key={key}>
              <Link to={items.__typename === "Organization"? "/github/org/"+items.login:"/github/"+items.login}>
                <img src={items.avatarUrl} alt="profile"></img>
                <p>{items.login}</p>
              </Link>
              </li>
          )
        }
      </ul>}
    </Container>
  )
}

const Container = styled.div`
  height: max-content;
  max-height: 80%;
  width: 40%;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 30%;
  top: 15%;
  box-shadow: 1px 3px 6px 2px rgb(220 220 220);
  >.title{
    position: fixed;
    top: 2.8em;
    height: max-content;
    width: 100%;
    left: 0;
    h1{
      width: max-content;
      margin: 0 auto;
    }
    @media screen and (max-width: 1000px) {
      position: absolute;
      top: -2.8em;
    }
    @media screen and (max-width: 400px) {
      top: -1.8em;
      h1{
        font-size: 1.1em;
      }
    }
  }
  &.curve{
    border-radius: 1.5em;
  }
  .hide{
    display: none;
  }
  ul{
    height: max-content;
    overflow-y: auto;
    li{
      img{
        border-radius: 50%;
        padding: 0.3em;
      }
      :hover{
        background-color: #d3d3d3;
      }
      a{
        display: flex;
        align-items: center;
        color: inherit;
        width: 100%;
        p{
          flex: 1;
          height: max-content;
          display: inline-flex;
          justify-content: flex-start;
        }
      }
      width: 100%;
      height: 3em;
      cursor: pointer;
    }
    .no-result{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2em;
      :hover{
        background-color: inherit;
      }
    }
  }
  @media screen and (max-width: 1000px) {
    width: 90%;
    left: 0;
    margin: 0 5%; 
  }
  @media screen and (max-width: 200px) {
    top: 20%;
    .title{
      top: -4.2em;
      h1{
        width: min-content;
      }
    }
  }
`

const SearchComponent = styled.div`
  display: flex;
  flex-direction: row;
  position: sticky;
  top: 0;
  padding: 0.1em 1em;
  width: 100%;
  border-radius: 0.1em;
  min-height: 3em;
  height: 3em;
  align-items: center;
  justify-content: center;
  input{
    flex:1;
    padding: 0;
    height: auto;
    font-size: 1.2em;
    width: inherit;
  }
  @media screen and (max-width: 200px) {

  }
`
