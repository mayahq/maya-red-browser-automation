const ExecuteFunction = require('./executeFunction.schema')

const execFuncNode = new ExecuteFunction()
const fn = (RED) => execFuncNode.config(RED)
module.exports = fn