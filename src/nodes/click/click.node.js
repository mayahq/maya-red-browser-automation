const Click = require('./click.schema')

const click = new Click()
const fn = (RED) => click.config(RED)
module.exports = fn