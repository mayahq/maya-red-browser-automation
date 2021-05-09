const { Node, Schema } = require('@mayahq/module-sdk')
const Connect = require('../connect/connect.schema')
const Page = require('../../utils/page')

class Type extends Node {
    static schema = new Schema({
        name: 'type',
        category: 'maya-browser-automation',
        fields: {
            selector: String,
            content: String,
            timeout: Number,
            tabId: Number,
            index: Number,
            connection: Connect
        }
    })

    async onMessage(msg, vals) {
        const { secretKey } = this.credentials.connection
        const page = new Page(secretKey)
        this.setStatus('PROGRESS', 'Typing...')

        try {
            await page.type(vals)
            this.setStatus('SUCCESS', 'Typed successfully')
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 10) + '...')
            msg.error = e
            msg.isError = true
        }

        return msg
    }
}

module.exports = Type