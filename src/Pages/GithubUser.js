import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"

export const GithubUser = () => {
  const GithubApi = require("../API/GithubApi")
  const params = useParams()
  const [data, setData] = useState(null)
  useEffect(() => {
    if(localStorage[params.user]){
      setData(JSON.parse(localStorage[params.user]))
    }else{
      GithubApi.getUser(params.user)
      .then(response => response.clone().json())
      .then(response => setData(response))
      .catch(e => console.error(e))
    }
    return () => {
      localStorage.removeItem(params.user)
    }
  }, [])

  useEffect(() => {
    localStorage[params.user] = JSON.stringify(data)
    console.log(data)

    // Get Commits
    GithubApi.getCommits()
    .then(response => response.clone().json())
    .then(response => console.log("Commits",response))
    .catch(e => console.error(e))

    // Get Followers
    GithubApi.getFollowers(params.user)
    .then(response => response.clone().json())
    .then(response => console.log("Followers",response))
    .catch(e => console.error(e))

    // Get Repos
    GithubApi.getRepos(params.user)
    .then(response => response.clone().json())
    .then(response => console.log("Repositories",response))
    .catch(e => console.error(e))

    // Get Organizations
    GithubApi.getOrgs(params.user)
    .then(response => response.clone().json())
    .then(response => console.log("Organizations",response))
    .catch(e => console.error(e))
    
  }, [data])
  
  return (
    <div>GithubUser</div>
  )
}
