const Type = require('./mayaBrowserType.schema')

const type = new Type()
const fn = (RED) => type.config(RED)
module.exports = fn