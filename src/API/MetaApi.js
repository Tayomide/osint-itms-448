const options = {
  method: "GET",
  headers: {
    "Authorization": "Bearer EAAPQMMBLfNABAJhEzswOEpsoLm0w6kFeiDDPR1AMtVDJ0OgcVPZAoOgvqMdEJGMnlvi2MCxVZAB6aSsmU8TSO6bCKLE1YoOLngm7JYgUa1eEZAC6pN9xR7wxvyWg6TkPD8PNLZBLC1WTGAF0lSCfW6BjkbJH91ocN1v6lBhZA3ZC4zSgimKmwa0x6NYM5xrNBRJX9tQmaIHBNeuccPyqgc",
    "Content-Type": "application/json"
  }
}

export const getMe = () => fetch("https://graph.facebook.com/me", options)