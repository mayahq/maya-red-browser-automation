const CloseTabs = require('./closeTabs.schema')

const closeTabsNode = new CloseTabs()
const fn = (RED) => closeTabsNode.config(RED)
module.exports = fn