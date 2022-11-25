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

export const getUserData = async (user) => {
  const query = `
    query($login: String!, $first: Int, $repositoriesFirst2: Int, $refPrefix: String!, $organizationsFirst2: Int, $followingFirst2: Int) {
      user(login: $login) {
        login
        name
        avatarUrl
        bio
        followers(first: $first) {
          totalCount
          nodes {
            avatarUrl
            bio
            createdAt
            company
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
            id
          }
        }
        following(first: $followingFirst2) {
          totalCount
          nodes {
            avatarUrl
            bio
            createdAt
            company
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
            id
          }
        }
        repositories(first: $repositoriesFirst2) {
          totalCount
          totalDiskUsage
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
        organizations(first: $organizationsFirst2) {
          totalCount
          nodes {
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
            membersWithRole {
              totalCount
            }
            repositories {
              totalCount
              totalDiskUsage
            }
          }
        }
      }
    }
  `
  const variables = `
  {
    "login": "${user}",
    "first": 50,
    "repositoriesFirst2": 100,
    "refPrefix": "refs/heads/",
    "organizationsFirst2": 50,
    "followingFirst2": 50
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

export const findUserNodes = async (user) => {
  const query = `
    query($query: String!, $type: SearchType!, $first: Int) {
      search(query: $query, type: $type, first: $first) {
        nodes {
          ... on User {
            login
            avatarUrl
            __typename
            url
          }
        }
      }
    }
  `
  const variables = `
    {  
      "query": "${user}",
      "type": "USER",
      "first": 30
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
export const findAccountNodes = async (user) => {
  const query = `
    query($query: String!, $type: SearchType!, $first: Int) {
      search(query: $query, type: $type, first: $first) {
        nodes {
          ... on Organization {
            login
            avatarUrl
            __typename
            url
          }
          ... on User {
            login
            avatarUrl
            __typename
            url
          }
        }
      }
    }
  `
  const variables = `
  {  
    "query": "${user}",
    "type": "USER",
    "first": 30
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