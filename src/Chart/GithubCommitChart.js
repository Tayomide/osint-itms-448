export const getOptions = () => {
  return ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Commit Activity',
      },
    },
  })
}

const sumReduce = (arr) => {
  let sum = 0
  for(let contribution of arr){
    sum += contribution.contributionCount
  }
  return sum
}


export const getData = async (user, graph) => {
  const labels = []
  const colorScheme = ['rgba(255, 99, 132, 0.5)', 'rgba(99, 255, 132, 0.5)', 'rgba(99, 132, 255, 0.5)', 'rgba(255, 132, 99, 0.5)', 'rgba(132, 99, 255, 0.5)']
  const dataset = []
  switch(graph){
    case "commits":
      for(let i = 0; i < 52; i++)labels[i] = "Week" + i.toString()
      break;
    case "followers":
      labels[0] = "Followers"
      break;
    case "following":
      labels[0] = "Following"
      break;
    case "repositories":
      labels[0] = "Repositories"
      break;
    default:
      throw new Error()
  }
  const GithubApi = require("../API/GithubApi")
  for(const name of user){
    let graphData
    switch(graph){
      case "commits":
        await GithubApi.getCommitGraph(name)
        .then(response => response.json())
        .then(response => {
          graphData = response.data.user.contributionsCollection.contributionCalendar.weeks
        })
        .catch(e => console.error(e))
        dataset.push({
            label: name,
            data: labels.map((label, idx) => sumReduce(graphData[idx].contributionDays)),
            backgroundColor: colorScheme.pop(),
        })
        break;
      case "followers":
        await GithubApi.getUser(name)
        .then(response => response.json())
        .then(response => {
          graphData = response.followers
        })
        .catch(e => console.error(e))
        dataset.push({
            label: name,
            data: [graphData],
            backgroundColor: colorScheme.pop(),
        })
        break;
      case "following":
        await GithubApi.getUser(name)
        .then(response => response.json())
        .then(response => {
          graphData = response.following
        })
        .catch(e => console.error(e))
        dataset.push({
            label: name,
            data: [graphData],
            backgroundColor: colorScheme.pop(),
        })
        break;
      case "repositories":
        await GithubApi.getUser(name)
        .then(response => response.json())
        .then(response => {
          graphData = response.public_repos
        })
        .catch(e => console.error(e))
        dataset.push({
            label: name,
            data: [graphData],
            backgroundColor: colorScheme.pop(),
        })
        break;
      default:
        throw new Error()
    }
  }
  return ({
    labels,
    datasets: [...dataset]
  })
}
