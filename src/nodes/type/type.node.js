const Type = require('./type.schema')

const type = new Type()
const fn = (RED) => type.config(RED)
module.exports = fn