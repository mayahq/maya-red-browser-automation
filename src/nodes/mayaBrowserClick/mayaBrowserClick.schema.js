const { 
    Node,
    Schema,
    fields
} = require('@mayahq/module-sdk')
const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Page = require('../../utils/page')

class Click extends Node {
    constructor(node, RED) {
        super(node, RED)
    }
    
    static schema = new Schema({
        name: 'maya-browser-click',
        category: 'Maya Browser Automation',
        label: 'Click',
        fields: {
            clickType: new fields.Select({ options: ['click', 'mouseX'] }),
            selector: new fields.Typed({ type: 'str', allowedTypes: ['msg', 'global', 'flow']}),
            timeout: new fields.Typed({ type: 'num', allowedTypes: ['msg', 'global', 'flow'], defaultVal: 2000}),
            tabId: new fields.Typed({ type: 'str', allowedTypes: ['msg', 'global', 'flow']}),
            index: new fields.Typed({ type: 'num', allowedTypes: ['msg', 'global', 'flow'], defaultVal: 0}),
            session: new fields.ConfigNode({ type: Connect })
        }
    })

    async onMessage(msg, vals) {
        if (msg.isError) {
            return msg
        }
        const { secretKey } = this.credentials.session
        const page = new Page(secretKey)
        this.setStatus('PROGRESS', 'Clicking...')

        try {
            const res = await page.click({
                clickType: vals.clickType,
                selector: vals.selector,
                index: vals.index,
                timeout: vals.timeout,
                tabId: vals.tabId
            })
            if (res.data.status === 'ERROR') {
                const error = res.data.error
                this.setStatus('ERROR', error.description)
                msg.error = error
                msg.isError = true
            } else {
                this.setStatus('SUCCESS', 'Clicked successfully')
            }
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 50) + '...')
            msg.error = e
            msg.isError = true
        }

        return msg
    }
}

module.exports = Click