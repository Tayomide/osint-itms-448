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

const labels = []

for(let i = 0; i < 52; i++)labels[i] = "Week" + i.toString()

const sumReduce = (arr) => {
  let sum = 0
  for(let contribution of arr){
    sum += contribution.contributionCount
  }
  return sum
}


export const getData = async (user) => {
  const GithubApi = require("../API/GithubApi")
  const dataset = []
  const colorScheme = ['rgba(255, 99, 132, 0.5)', 'rgba(99, 255, 132, 0.5)', 'rgba(99, 132, 255, 0.5)', 'rgba(255, 132, 99, 0.5)', 'rgba(132, 99, 255, 0.5)']
  for(const name of user){
    let commit
    await GithubApi.getCommitGraph(name)
    .then(response => response.json())
    .then(response => {
      commit = response.data.user.contributionsCollection.contributionCalendar.weeks
    })
    .catch(e => console.error(e))
    dataset.push({
        label: name,
        data: labels.map((label, idx) => sumReduce(commit[idx].contributionDays)),
        backgroundColor: colorScheme.pop(),
    })
  }
  console.log(dataset)
  
  return ({
    labels,
    datasets: [...dataset]
  })
}
