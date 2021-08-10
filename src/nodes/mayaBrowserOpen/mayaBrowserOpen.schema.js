const { Node, Schema, fields } = require('@mayahq/module-sdk')
const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Browser = require('../../utils/browser')

class Open extends Node {
    constructor(node, RED, opts) {
        super(node, RED, {...opts})
    }
    
    static schema = new Schema({
        name: 'maya-browser-open',
        category: 'Maya Browser Automation',
        label: 'Open',
        fields: {
            url: new fields.Typed({ type: 'str', allowedTypes: ['msg', 'flow', 'global'] }),
        },
        icon: "white-globe.svg"
    })

    async onMessage(msg, vals) {
        if (msg.isError) {
            return msg
        }
        const secretKey = this.tokens.vals.access_token
        const browser = new Browser(secretKey)
        this.setStatus('PROGRESS', `Opening ${vals.url}`)

        try {
            const result = await browser.open(vals.url)
            msg.tabs = [result.data.tab]
            this.setStatus('SUCCESS', `Opened ${vals.url}`)
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 50) + '...')
            msg.error = e
            msg.isError = true
        }

        return msg
    }
}

module.exports = Open