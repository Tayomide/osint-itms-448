import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { GithubUserStats } from "../Components/GithubUserStats";
import { GithubUserData } from "../Components/GithubUserData";
import { GithubUserGraph } from "../Components/GithubUserGraph";
import { SmartCarousel } from "../Components/SmartCarousel";
import { Loading } from "../Components/Loading";

export const GithubUser = () => {
  const navigate = useNavigate();
  const GithubApi = require("../API/GithubApi")
  const params = useParams()
  const [userData, setUserData] = useState()
  const [userStats, setUserStats] = useState()
  const [downloadStats, setDownloadStats] = useState()
  const [commitGraph, setCommitGraph] = useState()
  const [repoList, setRepoList] = useState()
  const [followersList, setFollowersList] = useState()
  const [followingList, setFollowingList] = useState()
  
  useEffect(() => {
    (async () => {
      const user = params.user
      let tempUserData = {}
      const tempUserStats = {}
      const tempDownloadStats = {}
      GithubApi.getUser(user)
      .then(response => response.json())
      .then(response => {
        if(response.type === "Organization")navigate(`/github/org/${params.user}`)
        tempUserData = response
        tempUserStats["Following"] = response.following
        tempUserStats["Followers"] = response.followers
        tempUserStats["Public Repositories"] = response.public_repos
      })

      await GithubApi.getUserData(user)
      .then(response => response.json())
      .then(response => {
        response = response.data.user
        const tempRepoList = []
        const tempFollowersList = []
        const tempFollowingList = []

        setUserData({
          ...tempUserData,
          "followers_count": response.followers.totalCount,
          "following_count": response.following.totalCount,
          "orgranization_count": response.organizations.totalCount,
          "repository_count": response.repositories.totalCount,
          "data_used": response.repositories.totalDiskUsage
        })

        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        for(const repository of response.repositories.nodes){
          const tempList = {}
          tempList["created"] = month[new Date(repository.createdAt).getMonth()] + " " + new Date(repository.createdAt).getFullYear()
          tempList["data used"] = repository.diskUsage+"kb"
          tempList["forks"] = repository.forkCount
          tempList["name"] = repository.name
          tempList["url"] = repository.url
          tempList["visibility"] = repository.visibility
          tempList["graphUrl"] = repository.openGraphImageUrl
          tempList["branches"] = repository.refs.totalCount
          tempRepoList.push(tempList)
        }
        setRepoList(tempRepoList)
        
        for(const user of response.followers.nodes){
          const tempList = {}
          tempList["user name"] = user.login
          tempList["followers"] = user.followers.totalCount
          tempList["following"] = user.following.totalCount
          tempList["organizations"] = user.organizations.totalCount
          tempList["repositories"] = user.repositories.totalCount
          tempList["data used"] = user.repositories.totalDiskUsage+"kb"
          tempList["avatarUrl"] = user.avatarUrl
          tempList["url"] = user.url
          tempFollowersList.push(tempList)
        }
        setFollowersList(tempFollowersList)

        for(const user of response.following.nodes){
          const tempList = {}
          tempList["user name"] = user.login
          tempList["followers"] = user.followers.totalCount
          tempList["following"] = user.following.totalCount
          tempList["organizations"] = user.organizations.totalCount
          tempList["repositories"] = user.repositories.totalCount
          tempList["data used"] = user.repositories.totalDiskUsage+"kb"
          tempList["avatarUrl"] = user.avatarUrl
          tempList["url"] = user.url
          tempFollowingList.push(tempList)
        }
        setFollowingList(tempFollowingList)

        tempUserStats["Organzations"] = response.organizations.totalCount
        tempUserStats["Repositories"] = response.repositories.totalCount
        tempUserStats["Data Used"] = response.repositories.totalDiskUsage+"kb"

        tempDownloadStats["All"] = {...tempUserData, ...response}
        tempDownloadStats["User's Followers"] = response.followers
        tempDownloadStats["User's Organizations"] = response.organizations
        tempDownloadStats["User's Repositories"] = response.repositories
        tempDownloadStats["User's Profile"] = tempUserStats
      })

      await GithubApi.getCommitGraph(user)
      .then(response => response.json())
      .then(response => {
        tempUserStats["Commits"] = response.data.user.contributionsCollection.contributionCalendar.totalContributions
        tempDownloadStats["User's Commits"] = response.data.user.contributionsCollection
        tempDownloadStats["All"] = {...tempDownloadStats["All"], "commits": response.data.user.contributionsCollection}
        setCommitGraph(response.data.user.contributionsCollection.contributionCalendar.weeks)
      })

      setUserStats(tempUserStats)
      setDownloadStats(tempDownloadStats)
    })()
  }, [GithubApi, params.user, navigate])

  const handleClickOne = (queryType) => {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(userData, null, 2)], {type: "application/json"});
    a.href = URL.createObjectURL(file);
    a.download = userData[queryType].split(".").join("") + "_OSINT_Org_Data";
    a.click();
  }

  return (
    <Container>
      {userData &&
      <>
        <ul className="header">
          <li>
            <img src={userData["avatar_url"]} alt="User Avatar" />
          </li>
          <li>
            <h1 className="org-name">
              <a href={userData["html_url"]} target="_blank" rel="noreferrer">{userData["login"]}</a>
              <button onClick={() => handleClickOne("login")}><FileDownloadOutlinedIcon /></button>
            </h1>
            <p>{userData["name"]}</p>
          </li>
        </ul>
        {userData["bio"] && <p className="description">{userData["bio"]}</p>}
      </>}
      <ul className="user-stats">
        {
          userStats &&
          <GithubUserStats data={userStats}/>
        }
        {
          downloadStats && 
          <GithubUserData data={downloadStats}/>
        }
        {
          commitGraph && 
          <GithubUserGraph data={commitGraph}/>
        }
      </ul>
      { 
        repoList ?
        <>
          { Object.keys(repoList).length !== 0 && <h2 className="tag">Repositories</h2> }
          <SmartCarousel list={repoList} type="repo"/> 
        </>: 
        <>
          <h2 className="tag">Repositories</h2>
          <Loading />
        </>
      }
      { 
        followersList ?
        <>
          { Object.keys(followersList).length !== 0 && <h2 className="tag">Followers</h2> }
          <SmartCarousel list={followersList} type="user"/> 
        </>: 
        <>
          <h2 className="tag">Followers</h2>
          <Loading />
        </>
      }
      { 
        followingList ?
        <>
          { Object.keys(followingList).length !== 0 && <h2 className="tag">Following</h2> }
          <SmartCarousel list={followingList} type="user"/> 
        </>: 
        <>
          <h2 className="tag">Following</h2>
          <Loading />
        </>
      }
      {/* Add Followers and Following */}
    </Container>
  )
}

const Container = styled.div`
  width: -webkit-fill-available;
  width: -moz-available;
  overflow-x: hidden;
  button{
    color: inherit
  }
  .tag{
    padding: 1em 2em;
    height: max-content;
    color: #707070;
  }
  > .header{
    display: flex;
    flex-direction: row;
    height: max-content;
    padding: 1em 1em;
    align-items: center;
    li{
      width: max-content;
      height: max-content;
      padding-left: 1em;
      display: flex;
      flex-direction: column;
      justify-content: center;
      img{
        height: 3em;
        border-radius: 50%;
      }
      .org-name{
        align-items: flex-end;
        color: #161656;
        display: inline-flex;
        flex-direction: row;
        a{
          color: #161656;
        }
        button{
          padding: 0 0 0.17em 0;
          height: max-content;
        }
      }
      p{
        font-weight: bold;
        color: #908a8a;
      }
    }
  }
  >p{
    height: max-content;
    padding: 0 0 2em 2em;
    font-size: 1.1em;
  }
  .user-stats{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1em;
    padding: 0 2em;
    height: max-content;
    *{
      height: max-content;
    }
    @media screen and (max-width: 780px){
      display: flex;
      flex-direction: column;
      gap: 1em;
    }
  }
  @media screen and (max-width: 350px) {
    > .header{
      flex-direction: column;
      align-items: flex-start;
      padding: 1em 0;
    }
    .description{
      padding: 0 0 2em 1em;
    }
  }
  @media screen and (max-width: 220px){
    .user-stats{
      padding: 0;
    }
  }
  
`
