import styled from "styled-components"
import { useEffect, useRef, useState } from "react"
import { GithubChart } from "../Components/GithubChart"
import AddIcon from '@mui/icons-material/Add';
import GitHubIcon from '@mui/icons-material/GitHub';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Link } from "react-router-dom"
import { DropdownMenu } from "../Components/DropdownMenu";

export const GithubCompare = () => {
  const GithubApi = require("../API/GithubApi")
  const [data, setData] = useState({message:"Loading..."})
  const [user, setUser] = useState("")
  const [userList, setUserList] = useState(localStorage["userList"] ? JSON.parse(localStorage["userList"]) : [])
  const [newUser, setNewUser] = useState(false)
  const [userAdd, setUserAdd] = useState(true)
  const [chartType, setChartType] = useState("commits")
  const [queryType, setQueryType] = useState("")
  const chartList = ["commits", "followers", "following", "repositories"]
  const [updateUser, setUpdateUser] = useState(false)
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

  const deleteUser = (userName) => {
    setUserList(userList.filter(name => name !== userName[0].toUpperCase() + userName.slice(1).toLowerCase()))
  }

  useEffect(() => {
    if(localStorage["userList"]){
      setUserList(JSON.parse(localStorage["userList"]))
    }
  }, [])

  useEffect(() => {
    if(userList.length >= 1)setQueryType(userList[0])
    if(userList.length >= 5)setUserAdd(false)
    else setUserAdd(true)
    localStorage["userList"] = JSON.stringify(userList)
  }, [userList])

  useEffect(() => {
    if(newUser)inputRef.current.focus()
    else setUser("")
  }, [newUser])

  useEffect(() => {
    if(queryType !== ""){
      const dataFile = {}

      // Get User
      GithubApi.getUser(queryType)
      .then(response => response.clone().json())
      .then(response => dataFile["User_Data"] = response)
      .catch(e => console.error(e))

      // Get Commits
      GithubApi.getCommits()
      .then(response => response.clone().json())
      .then(response => dataFile["Commits"] = response)
      .catch(e => console.error(e))

      // Get Followers
      GithubApi.getFollowers(queryType)
      .then(response => response.clone().json())
      .then(response => dataFile["Followers"] = response)
      .catch(e => console.error(e))

      // Get Repos
      GithubApi.getRepos(queryType)
      .then(response => response.clone().json())
      .then(response => dataFile["Repositories"] = response)
      .catch(e => console.error(e))

      // Get Organizations
      GithubApi.getOrgs(queryType)
      .then(response => response.clone().json())
      .then(response => dataFile["Organizations"] = response)
      .catch(e => console.error(e))

      setData(dataFile)
    }
  }, [queryType, GithubApi])

  const handleClickOne = (e) => {
    var a = document.createElement("a");
    let data2 = Object.values(data).map(name => JSON.stringify(name, null, 2))
    let content = "{\n" + data2.join(",\n") + "\n}"
    var file = new Blob([content], {type: "text/plain"});
    a.href = URL.createObjectURL(file);
    a.download = queryType + "_OSINT_Data";
    a.click();
  }

  const handleClickMultiple = (e) => {
    var a = document.createElement("a");
    let content = ""
    for(let name in data){
      content = JSON.stringify(data[name], null, 2)
      var file = new Blob([content], {type: "application/json"});
      a.href = URL.createObjectURL(file);
      a.download = queryType + "_" + name;
      a.click();
    }
  }

  return (
    <Container>
      <InputContainer>
        <DropdownMenu 
          type={chartType}
          setType={setChartType}
          list={chartList}
        />
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
        <ul className="dropdown-user" onClick={() => setUpdateUser(!updateUser)} tabIndex="1" onBlur={(e) => {if(!e.currentTarget.contains(e.relatedTarget))setUpdateUser(false)}}>
          <p>User List</p>
          <button></button>
          <ul>
            {updateUser && userList.map((userName, idx) => 
            <li key={idx}>
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
            </li>
          )}

          </ul>
        </ul>        
        
      </InputContainer>
      { userList.length > 0 && <div className="content">
        < GithubChart user={userList} type={chartType}/>
        <div className="conditions">
          <p>Github User Stat</p>
          <ul>
            <li>
              <button onClick={handleClickOne}>All <FileDownloadOutlinedIcon /></button>
              <button onClick={handleClickMultiple}><FileDownloadOutlinedIcon /></button>
              <DropdownMenu
                type={queryType}
                setType={setQueryType}
                list={userList}
              />
            </li>
          </ul>
        </div>
      </div>}
      
    </Container>
  )
}

const Container = styled.div`
  width: -webkit-fill-available;
  width: -moz-available;
  height: max-content;
  button{
    color: inherit;
  }
  .chart{
    border: 1px solid #e7e7e7;
    border-radius: 0.3em;
    padding: 0.3em 0.4em;
    margin: 0 0 0 1em;
  }
  .content{
    display: flex;
    flex-direction: row;
    .chart{
      height: 70vh;
      width: calc(70vw - 5em);
      canvas{
        height: inherit!important;
        width: inherit
      }
      @media screen and (max-width: 500px){
        height: 100vh;
      }
    }
    .conditions{
      width: 25vw;
      height: max-content;
      margin: 0 auto;
      padding: 1em 1em;
      border: 1px solid #e7e7e7;
      border-radius: 0.3em;
      *{
        height: max-content;
      }
      > ul{
        padding-top: 1em;
        li{
          display: flex;
          flex-direction: row;
          gap: 0.3em;
          > button{
            align-items: center;
            border: 1px solid #e7e7e7;
            border-radius: 0.3em;
            display: inline-flex;
            font-size: 1em;
            font-weight: bold;
            height: 2.3em;
            justify-content: center;
            padding: 0 0.4em 0 0.4em;
          }
          .dropdown{
            height: auto;
            max-width: 12em;
            flex: 1;
          }
        }
      }
      @media screen and (max-width: 1000px){
        width: 100%;
        margin: 0 1em;
      }
    }
    @media screen and (max-width: 350px){
      .conditions > ul > li{
        flex-direction: column-reverse;
        .dropdown{
          max-width: 100%;
          width: 100%;
          min-height: 2.3em;
          height: 2.3em;
        }
      }
    }

  }
  @media screen and (max-width: 800px){
    width: 100vw;
    .content{
      flex-direction: column;
      padding: 0 0.8em;
      .chart{
        margin: 0;
        width: 100%;
      }
      .conditions{
        margin: 1em 0;
      }
    }
  }
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 4.3em;
  padding: 1em;
  gap: 1.25em; //Remove this eventually
  .dropdown >p{
    font-weight: bold;
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
  .dropdown-user{
    align-items: center;
    background-color: #efefef;
    border-radius: 0.2em 0.2em 0.2em 0.2em;
    cursor: pointer;
    display: none;
    flex-direction: row;
    height: 2.3em;
    justify-content: space-between;
    padding: 0 1em;
    position: relative;
    width: 8em;
    ul{
      background-color: inherit;
      border-radius: 0.2em 0.2em 0.2em 0.2em;
      height: max-content;
      position: absolute;
      left: 0;
      right: 0;
      top: 3em;
      li{
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 2.3em!important;
        a{
          color: inherit;
          padding: 0 0 0 0.2em;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          display: flex;
          align-items: center;
          flex-direction: row;
          p{
            padding: 0 0 0 0.2em;
            overflow: hidden;
            text-overflow: ellipsis;
          }
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
    >p{
      font-weight: bold;
    }
    button {
      background-color: black;
      clip-path: polygon(100% 0%, 0 0%, 50% 100%);
      height: 0.5em!important;
      padding: 0;
      width: 0.8em;
    }
  }
  @media screen and (max-width: 800px){
    padding: 0.8em;
    .dropdown-user{
      display: flex;
    }
    .user{
      display: none;
    }
  }
  @media screen and (max-width: 500px){
    gap: 0.5em;
    .add-user-button button{
      width: max-content;
      padding: 0 0.5em;
    }
    .dropdown{
      width: 7em;
    }
    .dropdown, .dropdown-user{
      padding: 0 0.5em;
    }
  }
  @media screen and (max-width: 380px){
    flex-direction: column;
    height: max-content;
    .dropdown, .dropdown-user{
      width: 100%;
      >p{
        z-index: 1;
      }
      >ul{
        z-index: 3;
      }
    }
    .add-user-button button{
      width: 100%
    }
    .add-user-input input{
      flex: 1;
    }
  }
`
