import styled from "styled-components"
import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { SmartCarousel } from '../Components/SmartCarousel'
import { Loading } from "../Components/Loading"
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// import { HeaderLoading } from "../Components/HeaderLoading"

// Give better names for the download buttons.

export const GithubOrg = () => {
  const [repoList, setRepoList] = useState()
  const [userList, setUserList] = useState()
  const [orgData, setOrgData] = useState()

  const GithubAPI = require("../API/GithubApi")

  const params = useParams()
  useEffect(() => {
    GithubAPI.getOrg(params.org)
    .then(response => response.clone().json())
    .then(response => {
      const tempOrgData = {}
      const tempRepoList = []
      const tempUserList = []
      
      tempOrgData["name"] = response.data.organization.name
      tempOrgData["url"] = response.data.organization.url
      tempOrgData["user name"] = response.data.organization.login
      tempOrgData["avatarURL"] = response.data.organization.avatarUrl
      tempOrgData["description"] = response.data.organization.description
      tempOrgData["createdAt"] = new Date(response.data.organization.createdAt)
      tempOrgData["email"] = response.data.organization.email
      tempOrgData["hasSponsorsListing"] = response.data.organization.hasSponsorsListing
      tempOrgData["id"] = response.data.organization.id
      tempOrgData["isVerified"] = response.data.organization.isVerified
      tempOrgData["location"] = response.data.organization.location
      tempOrgData["organizationBillingEmail"] = response.data.organization.organizationBillingEmail
      tempOrgData["Number of users"] = response.data.organization.membersWithRoletotalCount
      tempOrgData["Number of repositories"] = response.data.organization.repositories.totalCount
      tempOrgData["Total disk usage of repositories"] = response.data.organization.repositories.totalDiskUsage

      setOrgData(tempOrgData)

      const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      for(const repository of response.data.organization.repositories.nodes){
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
      for(const user of response.data.organization.membersWithRole.nodes){
        const tempList = {}
        tempList["user name"] = user.login
        tempList["followers"] = user.followers.totalCount
        tempList["following"] = user.following.totalCount
        tempList["organizations"] = user.organizations.totalCount
        tempList["repositories"] = user.repositories.totalCount
        tempList["data used"] = user.repositories.totalDiskUsage+"kb"
        tempList["avatarUrl"] = user.avatarUrl
        tempList["url"] = user.url
        tempUserList.push(tempList)
      }
      setUserList(tempUserList)
    })
  }, [GithubAPI, params.org])

  const handleClickOne = (queryType) => {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(orgData, null, 2)], {type: "application/json"});
    a.href = URL.createObjectURL(file);
    a.download = orgData[queryType].split(".").join("") + "_OSINT_Org_Data";
    a.click();
  }

  return (
    <Container>
      {/* <HeaderLoading /> */}
      {orgData &&
      <>
        <ul className="header">
          <li>
            <img src={orgData["avatarURL"]} alt="Org Avatar" />
          </li>
          <li>
            <h1 className="org-name">
              <a href={orgData["url"]} target="_blank" rel="noreferrer">{orgData["user name"]}</a>
              <button onClick={() => handleClickOne("name")}><FileDownloadOutlinedIcon /></button>
            </h1>
            <p>{orgData["name"]}</p>
          </li>
        </ul>
        {orgData["description"] && <p className="description">{orgData["description"]}</p>}
      </>}
      <h2 className="tag">Repositories</h2>
      { 
        repoList ?
        <SmartCarousel list={repoList} type="repo"/> : 
        <Loading />
      }
      <h2 className="tag">Users</h2>
      { 
        userList ?
        <SmartCarousel list={userList} type="user"/> : 
        <Loading />
      }
    </Container>
    // Repository names
  )
}

const Container = styled.div`
  width: -webkit-fill-available;
  width: -moz-available;
  overflow-x: hidden;
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
`