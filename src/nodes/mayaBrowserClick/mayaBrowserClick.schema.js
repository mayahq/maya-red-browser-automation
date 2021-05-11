const { Node, Schema } = require('@mayahq/module-sdk')
const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Page = require('../../utils/page')

class Click extends Node {
    static schema = new Schema({
        name: 'maya-browser-click',
        category: 'Maya Browser Automation',
        label: 'Click',
        fields: {
            selector: String,
            timeout: Number,
            tabId: String,
            index: Number,
            connection: Connect
        }
    })

    async onMessage(msg, vals) {
        const { secretKey } = this.credentials.connection
        const page = new Page(secretKey)
        
        try {
            await page.click({
                selector: vals.selector,
                index: vals.index,
                timeout: vals.timeout,
                tabId: vals.tabId
            })
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 10) + '...')
            msg.error = e
            msg.isError = true
        }

        return msg
    }
}

module.exports = Click