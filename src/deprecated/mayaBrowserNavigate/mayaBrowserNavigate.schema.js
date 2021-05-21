const { Node, Schema } = require('@mayahq/module-sdk')
const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Page = require('../../utils/page')

class Navigate extends Node {
    static schema = new Schema({
        name: 'maya-browser-navigate',
        category: 'Maya Browser Automation',
        label: 'Navigate',
        fields: {
            url: String,
            tabId: String,
            timeout: Number,
            connection: Connect
        }
    })

    async onMessage(msg, vals) {
        const { secretKey } = this.credentials.connection
        const page = new Page(secretKey)
        this.setStatus('PROGRESS', `Navigating to ${vals.url}...`)

        try {
            await page.navigate(vals)
            this.setStatus('SUCCESS', `Navigated to ${vals.url}.`)
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 10) + '...')
            msg.error = e
            msg.isError = true
        }

        return msg
    }
}

module.exports = Navigate