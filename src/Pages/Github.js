import styled from "styled-components"
import { useEffect, useRef, useReducer, useState } from "react"
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom"

const GithubApi = require("../API/GithubApi")

const initalState = {
  list : localStorage["GithubUser"]? JSON.parse(localStorage["GithubUser"]) : [],
  searchBar : ["Type a Username"]
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
  const [loading, setLoading] = useState(false)
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
        setLoading(true);
        (async () => {
          await GithubApi.findUser(input)
          .then(response => response.json())
          .then(response => {
            if(typeof(response.items) === "object"){
              localStorage["GithubUser"] = JSON.stringify([...state.list, ...response.items])
              dispatch({type:"update",value:input, list:response.items})
            }
          })
          .catch(e => dispatch({type:"update",value:"", list:[]}))
          setLoading(false)
        })()
      }
    }
    
  }, [input])

  useEffect(() => {
    if(!loading)inputRef.current.focus()
  }, [loading])

  return (
    <Container onFocus={handleFocusChange} onBlur={handleBlurChange} onClick={() => inputRef.current.focus()} className={!display && "curve"}
    ref={searchRef} onMouseEnter={handleMouseIn} onMouseLeave={handleMouseOut}
    >
      <SearchComponent>
        <SearchIcon />
        <input id="search-username" type="text" onChange={handleInputChange} value={input} disabled={loading} ref={inputRef}/>
      </SearchComponent>
      {loading && <ul><li className="no-result">Loading...</li></ul>}
      {<ul className={display ? "": "hide"}>
        {
          (state.searchBar === [] && input && input !== "" && !loading) && (typeof(state.searchBar[0]) === "string" || state.searchBar[0]["login"]) ?
            <li className="no-result">No Username like "{input}" on GitHub</li> :
            state.searchBar.map((items, key) =>
              <li key={key}>
              <Link to={"/github/"+items.login}>
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
  top: 10%;
  box-shadow: 1px 3px 6px 2px rgb(220 220 220);
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
  }
`
