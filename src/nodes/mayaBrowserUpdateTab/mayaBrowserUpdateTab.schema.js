const {
    Node,
    Schema
} = require('@mayahq/module-sdk')
const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Page = require('../../utils/page')

class UpdateTab extends Node {
    static schema = new Schema({
        name: 'maya-browser-update-tab',
        category: 'Maya Browser Automation',
        label: 'Update Tab',
        isConfig: false,
        fields: {
            timeout: Number,
            updates: String,
            tabId: String,
            connection: Connect
        },

    })

    getTabIds(tabIdVal) {
        try {
            if (typeof tabIdVal === 'string') {
                return JSON.parse(tabIdVal)
            } else if (Array.isArray(tabIdVal)) {
                return tabIdVal.map((val) => {
                    if (typeof val === 'string' || typeof val === 'number') {
                        return val
                    } else if (val.id) {
                        return val.id
                    } else {
                        throw new Error('')
                    }
                })
                return tabIdVal
            } else if (typeof tabIdVal === 'number') {
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
        const { secretKey } = this.credentials.connection
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