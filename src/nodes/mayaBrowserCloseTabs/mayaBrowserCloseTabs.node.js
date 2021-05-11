const CloseTabs = require('./mayaBrowserCloseTabs.schema')

const closeTabsNode = new CloseTabs()
const fn = (RED) => closeTabsNode.config(RED)
module.exports = fn