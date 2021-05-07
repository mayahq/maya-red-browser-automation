const { Node, Schema } = require('@mayahq/module-sdk')
const Connect = require('../connect/connect.schema')
const Browser = require('../../utils/browser')

class CloseTabs extends Node {
    static schema = new Schema({
        name: 'close-tabs',
        category: 'maya-browser-automation',
        fields: {
            timeout: Number,
            tabIds: String,
            connection: Connect
        }
    })

    getCloseOpts(tabIds) {
        let tabIdList
        if (typeof tabIds === 'string') {
            tabIdList = tabIds.split(',')
        } else if (typeof tabIds === 'object' && Array.isArray(tabIds)) {
            tabIdList = tabIds
        } else {
          if (typeof tabIds === 'object') {
            if ((tabIds.close && !tabIds.keep) ||
                (!tabIds.close && tabIds.keep)) {
              return tabIds
            } else {
              delete tabIds['close']
              return tabIds
            }
          }
        }

        let tabIdOpts = {}
        if (tabIdList.some((id) => parseInt(id) < 0)) {
            tabIdOpts.keep = []
            tabIds.forEach((id) => {
                const numId = parseInt(id)
                if (numId < 0) {
                    tabIdOpts.keep.push(numId * -1)
                }
            })
        } else {
            tabIdOpts.close = []
            tabIds.forEach((id) => {
                const numId = parseInt(id)
                if (numId > 0) {
                    tabIdOpts.close.push(numId)
                }
            })
        }

        return tabIdOpts
    }

    async onMessage(msg, vals) {
        const { secretKey } = this.credentials.connection
        const browser = new Browser(secretKey)
        this.setStatus('PROGRESS', `Closing tabs...`)

        const closeOpts = this.getCloseOpts(vals.tabIds)

        try {
            await browser.close({ timeout: vals.timeout, closeOpts })
            this.setStatus('SUCCESS', 'Closed tabs.')
        } catch (e) {
            this.setStatus('ERROR', e.toString().substring(0, 10) + '...')
            msg.error = e
            msg.isError = true
        }

        return msg
    }
}

module.exports = CloseTabs