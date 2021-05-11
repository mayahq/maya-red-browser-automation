const { Node, Schema } = require('@mayahq/module-sdk')
const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Page = require('../../utils/page')

class ExecuteFunction extends Node {
    static schema = new Schema({
        name: 'maya-browser-execute-function',
        category: 'Maya Browser Automation',
        label: 'Execute Function',
        fields: {
            selector: String,
            timeout: Number,
            tabId: String,
            func: String,
            args: String,
            connection: Connect
        }
    })

    cleanArgs(args) {
        let error = false
        if (typeof args === 'string') {
            try {
                const structuredArgs = JSON.parse(args)
                return structuredArgs
            } catch (e) {
                error = true
            }
        } else if (typeof args === 'object' && Array.isArray(args)) {
            return args
        } else {
            error = true
        }

        if (error) {
            node.status({
                fill: "red",
                shape: "ring",
                text: "Unsupported argument format",
            });
            throw new Error("Unsupported argument format")
        }
    }

    async onMessage(msg, vals) {
        const { secretKey } = this.credentials.connection
        const page = new Page(secretKey)
        this.setStatus('PROGRESS', 'Executing...')
        
        const args = this.cleanArgs(vals.args)

        try {
            await page.executeFunction({ ...vals, args })
            this.setStatus('SUCCESS', 'Function executed successfully.')
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 10) + '...')
            msg.error = e
            msg.isError = true
        }

        return msg
    }
}

module.exports = ExecuteFunction