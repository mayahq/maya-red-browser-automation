const { 
    Node,
    Schema,
    fields
} = require('@mayahq/module-sdk')
const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Page = require('../../utils/page')

class Click extends Node {
    constructor(node, RED, opts) {
        super(node, RED, {...opts})
    }
    
    static schema = new Schema({
        name: 'maya-browser-click',
        category: 'Maya Browser Automation',
        label: 'Click',
        fields: {
            // clickType: new fields.Select({ options: ['click', 'mouseX'] }),
            clickType: new fields.SelectFieldSet({
                fieldSets: {
                    click: {},
                    mouseX: {
                        delay: new fields.Typed({ type: 'num', allowedTypes: ['msg', 'global', 'flow'], defaultVal: 100 })
                    }
                }
            }),
            highlightDuration: new fields.Typed({ type: 'num', allowedTypes: ['msg', 'global', 'flow'], defaultVal: 1000 }),
            selector: new fields.Typed({ type: 'str', allowedTypes: ['msg', 'global', 'flow']}),
            timeout: new fields.Typed({ type: 'num', allowedTypes: ['msg', 'global', 'flow'], defaultVal: 2000}),
            tabId: new fields.Typed({ type: 'msg', allowedTypes: ['msg', 'global', 'flow', 'str'], defaultVal:'tabs[0].id'}),
            index: new fields.Typed({ type: 'num', allowedTypes: ['msg', 'global', 'flow'], defaultVal: 0}),
        },
        icon: "white-globe.svg"
    })

    async onMessage(msg, vals) {
        const secretKey = this.tokens.vals.access_token
        const page = new Page(secretKey)
        this.setStatus('PROGRESS', 'Clicking...')

        try {
            let delay = null
            if (vals.clickType.selected === 'mouseX') {
                delay = vals.clickType.childValues.delay
            }
            const res = await page.click({
                clickType: vals.clickType.selected,
                delay: delay,
                highlightDuration: vals.highlightDuration,
                selector: vals.selector,
                index: vals.index,
                timeout: vals.timeout,
                tabId: vals.tabId
            })
            if (res.data.status === 'ERROR') {
                const error = res.data.error
                this.setStatus('ERROR', error.description)
                msg.__error = error
                msg.__isError = true
            } else {
                this.setStatus('SUCCESS', 'Clicked successfully')
            }
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 50) + '...')
            msg.__error = e
            msg.__isError = true
        }

        return msg
    }
}

module.exports = Click