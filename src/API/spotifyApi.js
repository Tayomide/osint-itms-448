const options = {
  method: "GET",
  headers: {
    "Authorization": "Bearer BQCTMzUwQpQ8GlEXdziFEfUQdrFxpog5pI9VH79tWTshqfFiBcqNgzG0zuyg3dNCsc3MGBzncwRPuA75nuHDnY2HO_Qyto0vRoX7nZQ_DRFis1-8usm4KCLBJQUBoIPvph7KmXYcV-pZkBVA7v-eoV3KmiMK4hw9gTgaV4lRHQI5R65aU0ZKK2tXtdOV5qSLy2U",
    "Content-Type": "application/json"
  }
}

export const getMe = () => fetch("https://api.spotify.com/v1/me", options)

export const getCategroies = () => fetch("https://api.spotify.com/v1/browse/categories", options)