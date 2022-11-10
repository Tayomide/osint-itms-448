// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    return {
      statusCode: 200,
      body: JSON.stringify({ GITHUB_TOKEN: process.env.GITHUB_TOKEN }),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
