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
  const [user, setUser] = useState("")
  const [userList, setUserList] = useState(localStorage["userList"] ? JSON.parse(localStorage["userList"]) : [])
  const [newUser, setNewUser] = useState(false)
  const [userAdd, setUserAdd] = useState(true)
  const [chartType, setChartType] = useState("commits")
  const [queryType, setQueryType] = useState("")
  const chartList = ["commits", "followers", "following", "repositories"]
  const [updateUser, setUpdateUser] = useState(false)
  const [userQueryList, setUserQueryList] = useState()
  const [userNodeList, setUserNodeList] = useState(localStorage["GithubUser"] ? JSON.parse(localStorage["GithubUser"]) : [])
  const [downloadStats, setDownloadStats] = useState()

  const inputRef = useRef()
  const addUser = (tempUserParam) => {
    setNewUser(false)
    const tempUser = tempUserParam || user
    setUser("")
    GithubApi.getUser(tempUser)
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
    let queryList = []
    if(user && user !== ""){
      let list = localStorage["GithubUser"] ? JSON.parse(localStorage["GithubUser"]) : []
      queryList = list.filter(i => i.login && i.login.toLowerCase().includes(user.toLowerCase()))
      if(user && queryList.length === 0)GithubApi.findUserNodes(user)
      .then(response => response.json())
      .then(response => {
        queryList = response.data.search.nodes.filter(i => i.login && i.login.toLowerCase().includes(user.toLowerCase()))
        setUserNodeList((prevState) => [...prevState, ...response.data.search.nodes])
      })
    }
    setUserQueryList(queryList.slice(0,6))
  }, [user, GithubApi])

  useEffect(() => {
    localStorage["GithubUser"] = JSON.stringify(userNodeList)
    if(user && user !== "")setUserQueryList(userNodeList.filter(i => i.login && i.login.toLowerCase().includes(user.toLowerCase())).slice(0,6))
  }, [userNodeList, user])

  useEffect(() => {
    if(queryType && queryType !== "")(async () => {
      // const user = queryType
      let tempUserData = {}
      const tempUserStats = {}
      const tempDownloadStats = {}
      GithubApi.getUser(queryType)
      .then(response => response.json())
      .then(response => {
        setDownloadStats()
        tempUserData = response
        tempUserStats["Following"] = response.following
        tempUserStats["Followers"] = response.followers
        tempUserStats["Public Repositories"] = response.public_repos
      })

      await GithubApi.getUserData(queryType)
      .then(response => response.json())
      .then(response => {
        response = response.data.user

        tempUserStats["Organzations"] = response.organizations.totalCount
        tempUserStats["Repositories"] = response.repositories.totalCount
        tempUserStats["Data Used"] = response.repositories.totalDiskUsage+"kb"

        tempDownloadStats["All"] = {...tempUserData, ...response}
        tempDownloadStats["User's Followers"] = response.followers
        tempDownloadStats["User's Organizations"] = response.organizations
        tempDownloadStats["User's Repositories"] = response.repositories
        tempDownloadStats["User's Profile"] = tempUserStats
      })

      await GithubApi.getCommitGraph(queryType)
      .then(response => response.json())
      .then(response => {
        tempDownloadStats["User's Profile"] = {...tempDownloadStats["User's Profile"], "Commits": response.data.user.contributionsCollection.contributionCalendar.totalContributions}
        tempDownloadStats["User's Commits"] = response.data.user.contributionsCollection
        tempDownloadStats["All"] = {...tempDownloadStats["All"], "commits": response.data.user.contributionsCollection}
      })
      
      setDownloadStats(tempDownloadStats)
    })()
  }, [GithubApi, queryType])

  const handleClickOne = (queryType1) => {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(downloadStats[queryType1], null, 2)], {type: "application/json"});
    a.href = URL.createObjectURL(file);
    a.download = queryType + "'s " + queryType1.split("User's ").join("") + "_Data";
    a.click();
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
          <ul className="dropdown-user-search" onClick={() => setNewUser(true)} tabIndex="2" onBlur={(e) => {if(!e.currentTarget.contains(e.relatedTarget))setNewUser(false)}}>
          <div className="add-user-input">
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
          </div>
          <ul>
            {userQueryList?.map((userName, idx) => 
            <li key={idx}>
              <button onClick={(e) => {e.stopPropagation();addUser(userName.login);setNewUser(false)}}>
                <img src={userName.avatarUrl} alt="Icon" />
                <p>{userName.login}</p>
              </button>
            </li>
          )}

          </ul>
        </ul>
          
          :
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
          <div>
            <p>Export User Data</p>
            <DropdownMenu
              type={queryType}
              setType={setQueryType}
              list={userList}
            />
          </div>
          <ul>
            {downloadStats &&
              Object.keys(downloadStats).map((key, idx) => <li key={idx}>
                <button onClick={() => handleClickOne(key)}>
                  <p>{key}</p>
                  <FileDownloadOutlinedIcon />
                </button>
              </li>)
            }
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
    border-radius: 0.3em;
    padding: 0.3em 0.4em;
  }
  .content{
    display: flex;
    flex-direction: row;
    gap: 1em;
    padding: 0 1em;
    .chart{
      max-height: calc(100vh - 7em);
      width: calc(70vw - 5em);
      canvas{
        height: inherit!important;
        width: inherit
      }
      @media screen and (max-width: 500px){
        min-height: 120vh;
        max-height: 200vh;
      }
      box-shadow: 0px 1px 3px 0px #00000030;
      padding: 0.5em;
    }
    .conditions{
      border-radius: 0.4em;
      width: -webkit-fill-available;
      width: -moz-available;
      padding: 1em;
      background-color: var(--main-color);
      box-shadow: 0px 1px 3px 0px #00000030;
      >div{
        > p{
          padding: 0 0 0.6em 0;
          font-size: 1.1em;
          font-weight: bold;
        }
        .dropdown{
          width: 100%;
          max-width: 10em;
        }
      }
      > ul{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 1em;
        padding-top: 1em;
      li{
        button{
          display: flex;
          flex-direction: row;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          border-radius: 0.4em;
          padding: 0.5em 0.7em;
          background-color: var(--main-bg-color);
          box-shadow: 0px 1px 3px 0px #00000066;
          color: white;
          p{
            font-size: 1.2em;
          }
            svg{
              height: auto;
              height: min-content;
            }
          }
        }
        @media screen and (max-width: 400px){
          display: flex;
          flex-direction: column;
          gap: 1em;
        }
      }
    }
    /* @media screen and (max-width: 350px){
      .conditions > ul > li{
        flex-direction: column-reverse;
        .dropdown{
          max-width: 100%;
          width: 100%;
          min-height: 2.3em;
          height: 2.3em;
        }
      }
    } */

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
      /* .conditions{
        margin: 1em 0;
      } */
    }
  }
  @media screen and (max-width: 200px){
    .content{
      padding: 0;
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
    background-color: var(--main-color);
    border-radius: 0.2em 0.2em 0.2em 0.2em;
    display: flex;
    flex-direction: row;
    height: 2.3em;
    box-shadow: 0px 1px 3px 0px #00000030;
    input[type="text"]{
      background-color: transparent;
      font-size: 1em;
      height: 2.3em;
      padding: 0 0.3em;
      width: 6em;
      text-transform: capitalize;
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
    background-color: var(--main-color);        
    display: flex;
    flex-direction: row;
    height: 2.3em;
    border-radius: 0.2em 0.2em 0.2em 0.2em;
    box-shadow: 0px 1px 3px 0px #00000030;
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
    background-color: var(--main-color);
    border-radius: 0.2em 0.2em 0.2em 0.2em;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    height: 2.3em;
    padding: 0 0 0 0.4em;
    position: relative;
    width: 8em;
    z-index: 0;
    box-shadow: 0px 1px 3px 0px #00000030;
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
        background-color: var(--main-bg-color);
        opacity: 0.9;
      }
      
    }
  }
  .dropdown-user, .dropdown-user-search{
    align-items: center;
    background-color: var(--main-color);
    border-radius: 0.2em 0.2em 0.2em 0.2em;
    cursor: pointer;
    display: none;
    flex-direction: row;
    height: 2.3em;
    justify-content: space-between;
    padding: 0 1em;
    position: relative;
    width: 8em;
    box-shadow: 0px 1px 3px 0px #00000030;
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
          color: black;
          padding: 0 0 0 0.2em;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          display: flex;
          align-items: center;
          flex-direction: row;
          svg{
            color: black;
            height: 24px;
            width: auto;
          }
          p{
            height: max-content;
            color: black;
            padding: 0 0 0 0.2em;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        :hover{
          background-color: var(--main-bg-color);
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
    &.dropdown-user button {
      background-color: black;
      clip-path: polygon(100% 0%, 0 0%, 50% 100%);
      height: 0.5em!important;
      padding: 0;
      width: 0.8em;
    }
  }
  .dropdown-user-search{
    display: flex;
    padding: 0;
    button{
      color: black;
      padding: 0 0 0 0.2em;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      display: flex;
      align-items: center;
      flex-direction: row;
      img{
        border-radius: 50%;
        height: 2.2em;
        width: auto;
      }
      p{
        height: max-content;
        color: black;
        padding: 0 0 0 0.2em;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1em;
        font-weight: bold;
      }
      :hover{
        background-color: var(--main-bg-color);
      }
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
    .dropdown, .dropdown-user, .dropdown-user-search{
      width: 100%;
      >p{
        z-index: 1;
      }
      >ul{
        z-index: 3;
      }
      input{
        flex: 1
      }
    }
    .dropdown-user-search {
      >div {
        flex: 1;
        button{
          max-width: max-content;
        }
    }}
    .add-user-button button{
      width: 100%
    }
    .add-user-input input{
      flex: 1;
    }
  }
`
