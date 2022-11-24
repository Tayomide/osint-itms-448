import styled from "styled-components"
import { useEffect, useRef, useReducer, useState } from "react"
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom"

const GithubApi = require("../API/GithubApi")

const initalState = {
  list : localStorage["GithubUser"]? JSON.parse(localStorage["GithubUser"]) : [],
  searchBar : localStorage["GithubUser"]? JSON.parse(localStorage["GithubUser"]) : ["Type a Username"]
}

const reducer = (state, action) => {
  switch(action.type){
    case "input":
      if(!action.value || action.value === "")return{...state, searchBar:["No result"]}
      return {...state, searchBar: state.list.filter(i => i.login.toLowerCase().includes(action.value.toLowerCase()))}
    case "update":
      if(!action.value || action.value === "" || !action.list || action.list.length === 0)return {...state, searchBar:["No result"]}
      return {list:[...state.list, ...action.list], searchBar:[...action.list]}
    default:
      throw new Error()
  }
}

export const Github = () => {
  const [input, setInput] = useState("")
  const [state, dispatch] = useReducer(reducer, initalState)
  const [display, setDisplay] = useState(false)
  const [mouse, setMouse] = useState(false)
  const inputRef = useRef()
  const searchRef = useRef()

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

  useEffect(() => {
    if(input !== ""){
      dispatch({type: "input",value: input})
      if(!state.list.find(elem => elem.login.toLowerCase().includes(input.toLowerCase()))){
        GithubApi.findUser(input)
        .then(response => response.json())
        .then(response => {
          if(typeof(response.items) === "object"){
            localStorage["GithubUser"] = JSON.stringify([...state.list, ...response.items])
            dispatch({type:"update",value:input, list:response.items})
          }
        })
        .catch(e => dispatch({type:"update",value:"", list:[]}))
      }
    }
    
  }, [input, state.list])

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
          ((state.searchBar.length === 0 || state.searchBar[0] === "No result") && input && input !== "")?
            <li className="no-result">No Username like "{input}" on GitHub</li> :
            input && input !== "" &&
            state.searchBar.map((items, key) =>
              <li key={key}>
              <Link to={items.type === "Organization"? "/github/org/"+items.login:"/github/"+items.login}>
                <img src={items.avatar_url} alt="profile"></img>
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
