const Navigate = require('./mayaBrowserNavigate.schema')

const navNode = new Navigate()
const fn = (RED) => navNode.config(RED)
module.exports = fn