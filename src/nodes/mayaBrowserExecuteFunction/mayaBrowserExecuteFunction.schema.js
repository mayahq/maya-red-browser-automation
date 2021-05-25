const { 
    Node,
    Schema,
    fields
} = require('@mayahq/module-sdk')
const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Page = require('../../utils/page')

class ExecuteFunction extends Node {
    constructor(node, RED) {
        super(node, RED)
    }
    
    static schema = new Schema({
        name: 'maya-browser-execute-function',
        category: 'Maya Browser Automation',
        label: 'Execute Function',
        fields: {
            selector: new fields.Typed({ type: 'str', allowedTypes: ['msg', 'global', 'flow'] }),
            timeout: new fields.Typed({ type: 'num', allowedTypes: ['msg', 'global', 'flow'], defaultVal: 2000 }),
            tabId: new fields.Typed({ type: 'msg', allowedTypes: ['msg', 'global', 'flow', 'str'], defaultVal:'tabs[0].id'}),
            func: new fields.Typed({ type: 'str', allowedTypes: ['msg', 'global', 'flow'], displayName: 'function' }),
            args: new fields.Typed({ type: 'json', allowedTypes: ['msg', 'global', 'flow'], displayName: 'arguments' }),
            session: new fields.ConfigNode({ type: Connect })
        }
    })

    cleanArgs(args) {
        if (!Array.isArray(args)) {
            throw new Error('Invalid argument spec, not an array')
        }

        return args
    }

    async onMessage(msg, vals) {
        if (msg.isError) {
            return msg
        }
        const { secretKey } = this.credentials.session
        const page = new Page(secretKey)
        this.setStatus('PROGRESS', 'Executing...')

        try {
            const args = this.cleanArgs(vals.args)
            const res = await page.executeFunction({ ...vals, args })
            if (res.data.status === 'ERROR') {
                const error = res.data.error
                this.setStatus('ERROR', error.description)
                msg.error = error
                msg.isError = true
            } else {
                this.setStatus('SUCCESS', 'Function executed successfully')
            }
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 50) + '...')
            msg.error = e
            msg.isError = true
        }

        return msg
    }
}

module.exports = ExecuteFunction