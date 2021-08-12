const { Node, Schema, fields } = require('@mayahq/module-sdk')
const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Browser = require('../../utils/browser')

class FindTab extends Node {
    constructor(node, RED, opts) {
        super(node, RED, {...opts})
    }
    
    static schema = new Schema({
        name: 'maya-browser-find-tab',
        category: 'Maya Browser Automation',
        label: 'Find Tab',
        fields: {
            query: new fields.Typed({ type: 'json', allowedTypes: ['msg', 'global', 'flow'] }),
        },
        icon: "white-globe.svg"
    })

    async onMessage(msg, vals) {
        const secretKey = this.tokens.vals.access_token
        const browser = new Browser(secretKey)
        this.setStatus('PROGRESS', 'Finding tab...')

        try {
            const result = await browser.findTab({ query: vals.query })
            const { data } = result
            msg.tabs = data.tabs 
            this.setStatus('SUCCESS', 'Found')
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 10) + '...')
            msg.__error = e
            msg.__isError = true
        }

        return msg
    }
}

module.exports = FindTab