const { Node, Schema } = require('@mayahq/module-sdk')
const Connect = require('../connect/connect.schema')
const Browser = require('../../utils/browser')

class FindTab extends Node {
    static schema = new Schema({
        name: 'find-tab',
        category: 'maya-browser-automation',
        fields: {
            query: String,
            connection: Connect
        }
    })

    async onMessage(msg, vals) {
        const { secretKey } = this.credentials.connection
        const browser = new Browser(secretKey)
        this.setStatus('PROGRESS', 'Finding tab...')

        try {
            const result = await browser.findTab({ query: vals.query })
            const { data } = result
            msg.tabsFound = data.tabs
            this.setStatus('SUCCESS', 'Found')
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 10) + '...')
            msg.error = e
            msg.isError = true
        }

        return msg
    }
}

module.exports = FindTab