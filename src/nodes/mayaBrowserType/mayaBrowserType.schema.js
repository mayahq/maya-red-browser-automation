const { Node, Schema, fields } = require('@mayahq/module-sdk')
const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Page = require('../../utils/page')

class Type extends Node {
    constructor(node, RED, opts) {
        super(node, RED, {...opts})
    }
    
    static schema = new Schema({
        name: 'maya-browser-type',
        category: 'Maya Browser Automation',
        label: 'Type',
        fields: {
            selector: new fields.Typed({ type: 'str', allowedTypes: ['msg', 'global', 'flow']}),
            timeout: new fields.Typed({ type: 'num', allowedTypes: ['msg', 'global', 'flow'], defaultVal: 2000}),
            tabId: new fields.Typed({ type: 'msg', allowedTypes: ['msg', 'global', 'flow', 'str'], defaultVal:'tabs[0].id'}),
            index: new fields.Typed({ type: 'num', allowedTypes: ['msg', 'global', 'flow'], defaultVal: 0}),
            content: new fields.Typed({ type: 'str', allowedTypes: ['msg', 'global', 'flow'] }),
        }
    })

    async onMessage(msg, vals) {
        const secretKey = this.tokens.vals.access_token
        const page = new Page(secretKey)
        this.setStatus('PROGRESS', 'Typing...')

        try {
            const res = await page.type(vals)
            if (res.data.status === 'ERROR') {
                const error = res.data.error
                this.setStatus('ERROR', error.description)
                msg.__error = error
                msg.__isError = true
            } else {
                this.setStatus('SUCCESS', 'Typed successfully')
            }
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 10) + '...')
            msg.__error = e
            msg.__isError = true
        }

        return msg
    }
}

module.exports = Type