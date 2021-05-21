const { Node, Schema, fields } = require('@mayahq/module-sdk')
const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Page = require('../../utils/page')

class Type extends Node {
    static schema = new Schema({
        name: 'maya-browser-type',
        category: 'Maya Browser Automation',
        label: 'Type',
        fields: {
            selector: new fields.Typed({ type: 'str', allowedTypes: ['msg', 'global', 'flow']}),
            timeout: new fields.Typed({ type: 'num', allowedTypes: ['msg', 'global', 'flow'], defaultVal: 2000}),
            tabId: new fields.Typed({ type: 'str', allowedTypes: ['msg', 'global', 'flow']}),
            index: new fields.Typed({ type: 'num', allowedTypes: ['msg', 'global', 'flow'], defaultVal: 0}),
            session: new fields.ConfigNode({ type: Connect }),
            content: new fields.Typed({ type: 'str', allowedTypes: ['msg', 'global', 'flow'] }),
        }
    })

    async onMessage(msg, vals) {
        if (msg.isError) {
            return msg
        }

        const { secretKey } = this.credentials.session
        const page = new Page(secretKey)
        this.setStatus('PROGRESS', 'Typing...')

        try {
            const res = await page.type(vals)
            if (res.data.status === 'ERROR') {
                const error = res.data.error
                this.setStatus('ERROR', error.description)
                msg.error = error
                msg.isError = true
            } else {
                this.setStatus('SUCCESS', 'Typed successfully')
            }
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 10) + '...')
            msg.error = e
            msg.isError = true
        }

        return msg
    }
}

module.exports = Type