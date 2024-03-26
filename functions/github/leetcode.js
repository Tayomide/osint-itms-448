// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    const username = "tayomide"
    let reply
    const query = `
      query userProfileCalendar($username: String!, $year: Int) {
        matchedUser(username: $username) {
          userCalendar(year: $year) {
            activeYears
            streak
            totalActiveDays
            dccBadges {
              timestamp
              badge {
                name
                icon
              }
            }
            submissionCalendar
          }
        }
      }
    `
  
    const variables = `
      {
        "username": "${username}",
        "year": "2022"
      }
    `
  
    const body = {
      query,
      variables
    }
  
    await fetch('https://leetcode.com/graphql', {method: "POST", body: JSON.stringify(body), headers: {
      "Content-Type": "application/json",
    }})
    .then(response => response.json())
    .then(response => {
      reply = response
    })
    return {
      statusCode: 200,
      body: JSON.stringify(reply),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
