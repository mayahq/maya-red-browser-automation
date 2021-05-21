const MayaBrowserQuery = require('./mayaBrowserQuery.schema')

const node = new MayaBrowserQuery()
const fn = (RED) => node.config(RED)
module.exports = fn