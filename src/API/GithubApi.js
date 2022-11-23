const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  }
}

export const getCommitGraph = async (user) => {
  const query = `
    query($userName:String!) {
      user(login: $userName){
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `
  const variables = `
    {
      "userName": "${user}"
    }
  `

  let Authorization;

  await fetch(`/.netlify/functions/github`, options)
  .then(response => response.json())
  .then(response => Authorization = `Bearer ${response.GITHUB_TOKEN}`)

  const body = {
    query,
    variables
  }
  return fetch('https://api.github.com/graphql', {method: "POST", body: JSON.stringify(body), headers: {
    "Authorization": Authorization
  }
  })
}

export const findUser = (user) => fetch(`https://api.github.com/search/users?q=${user}`, options)

export const getCommits = () => fetch(`https://api.github.com/repos/Tayomide/hci-project-one/stats/participation`, options)

export const getFollowers = (user) => fetch(`https://api.github.com/users/${user}/followers`, options)

export const getOrgs = (user) => fetch(`https://api.github.com/users/${user}/orgs`, options)

export const getRepos = (user) => fetch(`https://api.github.com/users/${user}/repos`, options)

export const getUser = (user) => fetch(`https://api.github.com/users/${user}`, options)

export const getVariables = () => fetch(`/.netlify/functions/github`, options)

export const getOrg = async (org) => {
  const query = `
    query($login: String!, $first: Int, $repositoriesFirst2: Int, $refPrefix: String!) {
      organization(login: $login) {
        name
        login
        avatarUrl
        url
        description
        createdAt
        email
        hasSponsorsListing
        id
        isVerified
        location
        organizationBillingEmail
        membersWithRole(first: $first) {
          totalCount #total users
          nodes {
            login
            name
            following {
              totalCount
            }
            followers {
              totalCount
            }
            organizations {
              totalCount
            }
            repositories {
              totalCount
              # Data used
              totalDiskUsage
            }
            avatarUrl
            url
          }
        }
        repositories(first: $repositoriesFirst2) {
          totalCount #total repositories
          totalDiskUsage #total diskusage
          nodes {
            createdAt
            diskUsage
            forkCount
            url
            visibility
            name
            openGraphImageUrl
            refs(refPrefix: $refPrefix) {
              totalCount
            }
          }
        }
      }
    }
  `
  const variables = `
  {
    "first": 30,
    "login": "${org}",
    "repositoriesFirst2": 30,
    "refPrefix": "refs/heads/"
  }
  `

  let Authorization;

  await fetch(`/.netlify/functions/github`, options)
  .then(response => response.json())
  .then(response => Authorization = `Bearer ${response.GITHUB_TOKEN}`)

  const body = {
    query,
    variables
  }
  return fetch('https://api.github.com/graphql', {method: "POST", body: JSON.stringify(body), headers: {
    "Authorization": Authorization
  }
  })
}