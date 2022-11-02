const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  }
}

export const findUser = (user) => fetch(`https://api.github.com/search/users?q=${user}`, options)

export const getCommits = () => fetch(`https://api.github.com/repos/Tayomide/hci-project-one/stats/participation`, options)

export const getFollowers = (user) => fetch(`https://api.github.com/users/${user}/followers`, options)

export const getOrgs = (user) => fetch(`https://api.github.com/users/${user}/orgs`, options)

export const getRepos = (user) => fetch(`https://api.github.com/users/${user}/repos`, options)

export const getUser = (user) => fetch(`https://api.github.com/users/${user}`, options)