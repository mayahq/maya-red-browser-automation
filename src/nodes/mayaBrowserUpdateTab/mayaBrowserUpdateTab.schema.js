const {
    Node,
    Schema,
    fields
} = require('@mayahq/module-sdk')
const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Page = require('../../utils/page')

class UpdateTab extends Node {
    constructor(node, RED) {
        super(node, RED)
    }
    
    static schema = new Schema({
        name: 'maya-browser-update-tab',
        category: 'Maya Browser Automation',
        label: 'Update Tab',
        isConfig: false,
        fields: {
            timeout: new fields.Typed({ type: 'num', allowedTypes: ['msg', 'global', 'flow'], defaultVal: 2000}),
            updates: new fields.Typed({ type: 'json', allowedTypes: ['msg', 'global', 'flow'] }),
            tabId: new fields.Typed({ type: 'str', allowedTypes: ['msg', 'global', 'flow', 'str'], defaultVal:'tabs[0].id'}),
            session: new fields.ConfigNode({ type: Connect })
        },

    })

    getTabIds(tabIdVal) {
        try {
            if (Array.isArray(tabIdVal)) {
                return tabIdVal.map((val) => {
                    if (typeof val === 'string' || typeof val === 'number') {
                        return val
                    } else if (val.id) {
                        return val.id
                    } else {
                        throw new Error('')
                    }
                })
            } else if (typeof tabIdVal === 'number' || typeof tabIdVal === 'string') {
                return tabIdVal
            } else {
                throw new Error('')
            }
        } catch (e) {
            throw new Error('Invalid defintion of tabId in update-tab node. It can only be an array of ids, an array of tab objects, a valid JSON stringified array, or a single number')
        }
    }

    getUpdates(updatesVal) {
        if (typeof updatesVal === 'string') {
            return { url: updatesVal }
        }
        return updatesVal
    }

    async onMessage(msg, vals) {
        if (msg.isError) {
            return msg
        }
        const { secretKey } = this.credentials.session
        const page = new Page(secretKey)

        try {
            const tabIds = this.getTabIds(vals.tabId)
            const result = await page.update({
                tabId: tabIds,
                updates: vals.updates,
                timeout: vals.timeout
            })

            msg.updatedTabs = result
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 10) + '...')
            msg.error = e
            msg.isError = true
        }

        return msg
    }
}

module.exports = UpdateTab