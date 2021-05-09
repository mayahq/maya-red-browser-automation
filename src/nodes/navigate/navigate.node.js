const Navigate = require('./navigate.schema')

const navNode = new Navigate()
const fn = (RED) => navNode.config(RED)
module.exports = fn