const { 
    Node,
    Schema,
    fields
} = require('@mayahq/module-sdk')
const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Browser = require('../../utils/browser')

class CloseTabs extends Node {
    constructor(node, RED, opts) {
        super(node, RED, {...opts})
    }
    
    static schema = new Schema({
        name: 'maya-browser-close-tabs',
        category: 'Maya Browser Automation',
        label: 'Close Tabs',
        fields: {
            action: new fields.Select({ options: ['Close', 'Exclude'], defaultVal: 'Close' }),
            timeout: new fields.Typed({ type: 'num', allowedTypes: ['msg', 'global', 'flow'], defaultVal: 2000 }),
            tabIds: new fields.Typed({ type: 'json', allowedTypes: ['msg', 'global', 'flow'] }),
        },
        icon: "white-globe.svg"
    })

    getTabIds(tabIds) {
        let tabIdList = []
        if (Array.isArray(tabIds)) {
            tabIds.forEach((ele) => {
                if (typeof ele === 'string' || typeof ele === 'number') {
                    tabIdList.push(ele)
                } else if (ele.id) {
                    tabIdList.push(ele.id)
                } else {
                    throw new Error('Invalid tabId specification')
                }
            })
        } else if(typeof tabIds === 'object'){
            tabIdList.push(tabIds.id);
        } else if(typeof ele === 'string' || typeof ele === 'number') {
            tabIdList.push(tabIds);
        }

        return tabIdList
    }

    async onMessage(msg, vals) {
        const secretKey = this.tokens.vals.access_token
        const browser = new Browser(secretKey)
        this.setStatus('PROGRESS', `Closing tabs...`)
        const tabIds = this.getTabIds(vals.tabIds)
        const closeOpts = { close: [], keep: [] }
        if (vals.action === 'Close') {
            closeOpts.close = tabIds
        } else {
            closeOpts.keep = tabIds
        }

        try {
            await browser.close({ timeout: vals.timeout, closeOpts })
            this.setStatus('SUCCESS', 'Closed tabs.')
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 50) + '...')
            msg.__error = e
            msg.__isError = true
        }

        return msg
    }
}

module.exports = CloseTabs