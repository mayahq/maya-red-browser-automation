const Open = require('./mayaBrowserOpen.schema')

const openNode = new Open()
const fn = (RED) => openNode.config(RED)
module.exports = fn