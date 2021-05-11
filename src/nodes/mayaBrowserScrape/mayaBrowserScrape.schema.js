const { Node, Schema } = require('@mayahq/module-sdk')
const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Page = require('../../utils/page')

class Scrape extends Node {
    static schema = new Schema({
        name: 'maya-browser-scrape',
        category: 'Maya Browser Automation',
        label: 'Scrape',
        fields: {
            query: String,
            timeout: Number,
            tabId: String,
            connection: Connect
        }
    })

    async onMessage(msg, vals) {
        const { secretKey } = this.credentials.connection
        const page = new Page(secretKey)
        this.setStatus('PROGRESS', 'Scraping...')

        try {
            const result = await page.scrape(vals)
            msg.result = result.data
            this.setStatus('SUCCESS', 'Scraped successfully.')
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 10) + '...')
            msg.error = e
            msg.isError = true
        }

        return msg
    }
}

module.exports = Scrape