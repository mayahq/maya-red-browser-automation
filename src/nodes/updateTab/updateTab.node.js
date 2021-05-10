const UpdateTab = require('./updateTab.schema')

const node = new UpdateTab()
const fn = (RED) => node.config(RED)
module.exports = fn