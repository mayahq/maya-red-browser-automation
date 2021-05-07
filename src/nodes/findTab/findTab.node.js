const FindTab = require('./findTab.schema')

const findTabNode = new FindTab()
const fn = (RED) => findTabNode.config(RED)
module.exports = fn