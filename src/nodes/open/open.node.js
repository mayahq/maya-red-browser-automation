const Open = require('./open.schema')

const openNode = new Open()
const fn = (RED) => openNode.config(RED)
module.exports = fn