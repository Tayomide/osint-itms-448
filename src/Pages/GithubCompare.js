import styled from "styled-components"
import { useEffect, useRef, useState } from "react"
import { GithubChart } from "../Components/GithubChart"
import AddIcon from '@mui/icons-material/Add';
import GitHubIcon from '@mui/icons-material/GitHub';

export const GithubCompare = () => {
  const GithubApi = require("../API/GithubApi")
  const [user, setUser] = useState("")
  const [userList, setUserList] = useState([])
  const [newUser, setNewUser] = useState(false)
  const [userAdd, setUserAdd] = useState(true)
  const inputRef = useRef()
  const addUser = () => {
    setNewUser(false)
    const tempUser = user
    setUser("")
    GithubApi.getUser(user)
    .then(response => response.clone().json())
    .then(response => {
      if((!response["message"] || response["message"] !== "Not Found") && !userList.includes(tempUser[0].toUpperCase() + tempUser.slice(1).toLowerCase())){
        setUserList([...userList, tempUser[0].toUpperCase() + tempUser.slice(1).toLowerCase()])
      }
    })
    .catch(e => console.error(e))
  }

  useEffect(() => {
    if(userList.length >= 5)setUserAdd(false)
  }, [userList])

  useEffect(() => {
    if(newUser)inputRef.current.focus()
  }, [newUser])

  return (
    <Container>
      <InputContainer>
        {userAdd &&
        <>
        {newUser ? 
          <div className="add-user-input">
            <input type="text" value={user} onChange={(e) => setUser(e.target.value)} ref={inputRef}/>
            <button><AddIcon sx={{
            aspectRatio: "1 / 1",
            height: "inherit",
            fontWeight: 'bold'
          }}
          onClick={addUser}
          /></button>
          </div> :
          <div className="add-user-button">
            <button onClick={() => setNewUser(true)}>Add User</button>
          </div>
        }
        </>}
        {userList.map((userName, idx) => 
          <div className="user" key={idx}>
          <GitHubIcon sx={{
            aspectRatio: "1 / 1",
            height: "inherit",
            fontWeight: 'bold'
          }}/>
            <p>{userName}</p>
          </div>
        )}
        
      </InputContainer>
      { userList.length > 0 && < GithubChart user={userList}/>}
      
    </Container>
  )
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 4.3em;
  padding: 1em;
  gap: 2em; //Remove this eventually
  .add-user-input{
    height: 2.3em;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 0.2em 0.2em 0.2em 0.2em;
    background-color: #efefef;
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
    display: flex;
    flex-direction: row;
    height: 2.3em;
    padding: 0 0 0 0.4em;
    width: 8em;
    p{
      font-size: 1em;
      font-weight: bold;
      height: max-content;
      padding-left: 0.2em;
      max-width: 6em;
      overflow: hidden;
      text-overflow: ellipsis;
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
