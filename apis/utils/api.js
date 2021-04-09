const axios = require("axios")

const baseURL = 'http://127.0.0.1:29568/api'
console.log("baseURL", baseURL)
const api = axios.create({ baseURL })

module.exports = api