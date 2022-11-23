import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { GithubUserHeader } from "../Components/GithubUserHeader"
import styled from "styled-components"
import { GithubStat } from "../Components/GithubStat"
import { GithubChart } from "../Components/GithubChart"
import { useNavigate } from "react-router-dom"

export const GithubUser = () => {
  const navigate = useNavigate();
  const GithubApi = require("../API/GithubApi")
  const params = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fileData, setFileData] = useState("")
  useEffect(() => {
    (
      async function(){
        setLoading(true)
        if(localStorage[params.user]){
          setData(JSON.parse(localStorage[params.user]))
        }else{
          await GithubApi.getUser(params.user)
          .then(response => response.clone().json())
          .then(response => {
            if(response.type === "Organization")navigate(`/github/org/${params.user}`)
            setData(response)
          })
          .catch(e => console.error(e))
        }
        setLoading(false)
      }
    )()

    return () => {
      localStorage.removeItem(params.user)
    }
  }, [GithubApi, params.user, navigate])

  useEffect(() => {
    localStorage[params.user] = JSON.stringify(data)

  }, [data, GithubApi, params.user])

  useEffect(() => {
    (async () => {
      const dataFile = {"User_Data": data}

      await GithubApi.getCommits()
      .then(response => response.clone().json())
      .then(response => dataFile["Commits"] = response)
      .catch(e => console.error(e))

      // Get Followers
      await GithubApi.getFollowers(params.user)
      .then(response => response.clone().json())
      .then(response => dataFile["Followers"] = response)
      .catch(e => console.error(e))

      // Get Repos
      await GithubApi.getRepos(params.user)
      .then(response => response.clone().json())
      .then(response => dataFile["Repositories"] = response)
      .catch(e => console.error(e))

      // Get Organizations
      await GithubApi.getOrgs(params.user)
      .then(response => response.clone().json())
      .then(response => dataFile["Organizations"] = response)
      .catch(e => console.error(e))

      setFileData(dataFile)
    })()
  }, [data, GithubApi, params.user])
  
  
  return (
    <Container>
      {!loading?
      <>
        <GithubUserHeader 
        userName={data?.login}
        data={fileData}
        url={data?.html_url}
        />
        <GithubStatContainer>
          <GithubStat
          title="Public Repositories"
          stat={data.public_repos}
          />
          <GithubStat
          title="Followers"
          stat={data.followers}
          />
          <GithubStat
          title="Following"
          stat={data.following}
          />
        </GithubStatContainer>
        <GithubChart user={[params.user]} type="commits"/>
      </>:
      <p>Loading...</p>
    }
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  *{
    height: auto;
  }
`

const GithubStatContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`
