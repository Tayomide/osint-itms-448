import styled from "styled-components"
import { useEffect, useRef, useState } from "react"
import { GithubChart } from "../Components/GithubChart"
import AddIcon from '@mui/icons-material/Add';
import GitHubIcon from '@mui/icons-material/GitHub';
import ClearIcon from '@mui/icons-material/Clear';
import { Link } from "react-router-dom"

export const GithubCompare = () => {
  const GithubApi = require("../API/GithubApi")
  const [user, setUser] = useState("")
  const [userList, setUserList] = useState([])
  const [newUser, setNewUser] = useState(false)
  const [userAdd, setUserAdd] = useState(true)
  const [chartType, setChartType] = useState("commits")
  const chartList = ["commits", "followers", "following", "repositories"]
  const [updateChart, setUpdateChart] = useState(false)
  const inputRef = useRef()
  const addUser = () => {
    setNewUser(false)
    const tempUser = user
    setUser("")
    GithubApi.getUser(user)
    .then(response => response.clone().json())
    .then(response => {
      if((!response["message"] || response["message"] !== "Not Found") &&
      response["type"] !== "Organization" &&
      !userList.includes(tempUser[0].toUpperCase() + tempUser.slice(1).toLowerCase())){
        setUserList([...userList, tempUser[0].toUpperCase() + tempUser.slice(1).toLowerCase()])
      }
    })
    .catch(e => console.error(e))
  }

  const updateChartType = (type) => {
    setUpdateChart(false)
    setChartType(type)
  }

  const deleteUser = (userName) => {
    setUserList(userList.filter(name => name !== userName[0].toUpperCase() + userName.slice(1).toLowerCase()))
  } 

  useEffect(() => {
    if(userList.length >= 5)setUserAdd(false)
  }, [userList])

  useEffect(() => {
    if(newUser)inputRef.current.focus()
    else setUser("")
  }, [newUser])

  return (
    <Container>
      <InputContainer>
      <div className="chart-type-dropdown" onClick={() => setUpdateChart(!updateChart)} tabIndex="1" onBlur={() => setUpdateChart(false)}>
        <p>{chartType}</p>
        <button></button>
        {updateChart && 
          <ul>
            {chartList.map((type, idx) => <li key={idx} onClick={() => updateChartType(type)}><p>{type}</p></li>)}
          </ul>
        }
      </div>
        {userAdd &&
        <>
        {newUser ?
          <div className="add-user-input" tabIndex="2" onBlur={(e) => {if(!e.currentTarget.contains(e.relatedTarget))setNewUser(false)}}>
            <input type="text" value={user}
            onChange={(e) => setUser(e.target.value)}
            onKeyDown={(e) => {if(e.code === "Enter")addUser()}}
            ref={inputRef}/>
            <button onClick={addUser}><AddIcon sx={{
            aspectRatio: "1 / 1",
            height: "inherit",
            fontWeight: 'bold'
          }}
          /></button>
          </div> :
          <div className="add-user-button">
            <button onClick={() => setNewUser(true)}>Add User</button>
          </div>
        }
        </>}
        {userList.map((userName, idx) => 
          <div className="user" key={idx}>
            <Link to={"../github/" + userName.toLowerCase()}>
              <GitHubIcon sx={{
                aspectRatio: "1 / 1",
                width: "max-content",
                fontWeight: 'bold'
              }}/>
              <p>{userName}</p>
            </Link>
            <ClearIcon className="delete-user" sx={{
              aspectRatio: "1 / 1",
              height: "inherit",
              fontWeight: 'bold'
            }}
            onClick={() => deleteUser(userName)}
            />
          </div>
        )}
        
      </InputContainer>
      { userList.length > 0 && < GithubChart user={userList} type={chartType}/>}
      
    </Container>
  )
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 4.3em;
  padding: 1em;
  gap: 1.25em; //Remove this eventually
  .chart-type-dropdown{
    align-items: center;
    background-color: #efefef;
    border-radius: 0.2em 0.2em 0.2em 0.2em;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    height: 2.3em;
    justify-content: space-between;
    padding: 0 1em;
    position: relative;
    width: 10em;
    ul{
      background-color: inherit;
      border-radius: 0.2em 0.2em 0.2em 0.2em;
      height: max-content;
      position: absolute;
      right: 0;
      top: 3em;
      width: inherit;
      li{
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 2.3em;
        p{
          padding: 0 0 0 1em;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }
        :hover{
          background-color: #d4d3d3;
        }
      }
    }
    p{
      height: max-content;
      text-transform: capitalize;
    }
    button {
      width: 0.8em;
      height: 0.5em;
      background-color: black;
      clip-path: polygon(100% 0%, 0 0%, 50% 100%);
    }
  }
  .add-user-input{
    align-items: center;
    background-color: #efefef;
    border-radius: 0.2em 0.2em 0.2em 0.2em;
    display: flex;
    flex-direction: row;
    height: 2.3em;
    input[type="text"]{
      background-color: transparent;
      font-size: 1em;
      height: 2.3em;
      padding: 0 0.3em;
      width: 6em;
    }
    button{
      font-size: 1em;
      height: 2.3em;
      padding: 0;
      font-weight: bold;
      width: 2em;
    }
  }
  .add-user-button{
    align-items: center;
    background-color: #efefef;        
    display: flex;
    flex-direction: row;
    height: 2.3em;
    border-radius: 0.2em 0.2em 0.2em 0.2em;
    button{
      align-items: center;
      display: inline-flex;
      font-size: 1em;
      font-weight: bold;
      height: 2.3em;
      justify-content: center;
      padding: 0 0.2em 0 0.4em;
      width: 8em;
    }
  }
  .user{
    align-items: center;
    background-color: #efefef;
    border-radius: 0.2em 0.2em 0.2em 0.2em;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    height: 2.3em;
    padding: 0 0 0 0.4em;
    position: relative;
    width: 8em;
    z-index: 0;
    > a{
      align-items: center;
      color: inherit;
      display: inline-flex;
      flex-direction: row;
      flex: 1
    }
    p{
      font-size: 1em;
      font-weight: bold;
      height: max-content;
      padding-left: 0.2em;
      max-width: 6em;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .delete-user{
      background: inherit;
      display: none;
      position: absolute;
      right: 0;
      z-index: 2;
    }
    :hover > .delete-user{
      display: block;
      :hover{
        height: auto;
        border-radius: 50%;
        background-color: #dedddd;
      }
      
    }
  }
`

const Container = styled.div`
  .chart{
    height: 80vh;
    width: 80vw;
    canvas{
      height: inherit!important;
      width: inherit
    }
  }
`
