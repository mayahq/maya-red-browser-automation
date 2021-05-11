const { Node, Schema } = require('@mayahq/module-sdk')
const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Browser = require('../../utils/browser')

class Open extends Node {
    static schema = new Schema({
        name: 'maya-browser-open',
        category: 'Maya Browser Automation',
        label: 'Open',
        fields: {
            url: String,
            connection: Connect
        }
    })

    async onMessage(msg, vals) {
        const { secretKey } = this.credentials.connection
        const browser = new Browser(secretKey)
        this.setStatus('PROGRESS', `Opening ${vals.url}`)

        try {
            const result = await browser.open(vals.url)
            msg.data = result.data
            this.setStatus('SUCCESS', `Opened ${vals.url}`)
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 10) + '...')
            msg.error = e
            msg.isError = true
        }

        return msg
    }
}

module.exports = Open