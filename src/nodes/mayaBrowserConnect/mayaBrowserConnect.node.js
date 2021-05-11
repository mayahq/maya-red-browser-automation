const Connect = require('./mayaBrowserConnect.schema')

const conn = new Connect()
const fn = (RED) => conn.config(RED)
module.exports = fn