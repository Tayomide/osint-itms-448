const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  }
}

// const TOKEN = process.env.GITHUB_TOKEN

// export async function retrieveContributionData(userName: string): Promise<Externals.Github.ApiResponse> {
  
//   const res = await fetch('https://api.github.com/graphql', {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${TOKEN}`,
//     },
//     body: JSON.stringify(body)
//   })
//   return res.json()
// }

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

// 