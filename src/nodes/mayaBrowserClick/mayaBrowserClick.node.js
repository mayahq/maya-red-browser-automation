const Click = require('./mayaBrowserClick.schema')

const click = new Click()
const fn = (RED) => click.config(RED)
module.exports = fn