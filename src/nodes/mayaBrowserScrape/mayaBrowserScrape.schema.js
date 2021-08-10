const { Node, Schema, fields } = require('@mayahq/module-sdk')
const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Page = require('../../utils/page')

class Scrape extends Node {
    constructor(node, RED, opts) {
        super(node, RED, {...opts})
    }
    
    static schema = new Schema({
        name: 'maya-browser-scrape',
        category: 'Maya Browser Automation',
        label: 'Scrape',
        fields: {
            query: new fields.Typed({ type: 'json', allowedTypes: ['msg', 'flow', 'global'] }),
            timeout: new fields.Typed({ type: 'num', allowedTypes: ['msg', 'global', 'flow'], defaultVal: 2000}),
            tabId: new fields.Typed({ type: 'msg', allowedTypes: ['msg', 'global', 'flow', 'str'], defaultVal:'tabs[0].id'})
        },
        icon: "white-globe.svg"
    })

    async onMessage(msg, vals) {
        if (msg.isError) {
            return msg
        }
        const secretKey = this.tokens.vals.access_token
        const page = new Page(secretKey)
        this.setStatus('PROGRESS', 'Scraping...')

        try {
            const res = await page.scrape(vals)
            if (res.data.status === 'ERROR') {
                const error = res.data.error
                this.setStatus('ERROR', error.description)
                msg.error = error
                msg.isError = true
            } else {
                this.setStatus('SUCCESS', 'Scraped Successfully')
                msg.scrapeResult = res.data.data
            }
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 50) + '...')
            msg.error = e
            msg.isError = true
        }

        return msg
    }
}

module.exports = Scrape