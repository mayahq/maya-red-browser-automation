const {
    Node,
    Schema,
    fields
} = require('@mayahq/module-sdk')
const Browser = require('../../utils/browser')


class MayaBrowserTabFunction extends Node {
    constructor(node, RED, opts) {
        super(node, RED, {
            ...opts,
            // masterKey: 'You can set this property to make the node fall back to this key if Maya does not provide one'
        })
    }

    static schema = new Schema({
        name: 'maya-browser-tab-function',
        label: 'Tab Function',
        category: 'Maya Browser Automation',
        isConfig: false,
        fields: {
            action: new fields.SelectFieldSet({
                fieldSets: {
                    hide: {
                        tabIdsToHide: new fields.Typed({
                            type: 'json',
                            allowedTypes: ['num', 'msg', 'flow', 'global'],
                            defaultVal: '[]',
                            displayName: 'Tab IDs'
                        })
                    },
                    show: {
                        tabIdsToShow: new fields.Typed({
                            type: 'json',
                            allowedTypes: ['num', 'msg', 'flow', 'global'],
                            defaultVal: '[]',
                            displayName: 'Tab IDs'
                        })
                    }
                }
            })
        },

    })

    async onMessage(msg, vals) {
        this.setStatus('PROGRESS', 'Executing tab function')
        
        const secretKey = this.tokens.vals.access_token
        const browser = new Browser(secretKey)

        const payload = {
            funcType: vals.action.selected
        }

        switch (vals.action.selected) {
            case 'hide': {
                payload.tabIds = vals.action.childValues.tabIdsToHide
                break
            }
            case 'show': {
                payload.tabIds = vals.action.childValues.tabIdsToShow
                break
            }
            default: {
                console.log('Invalid function! msg:', msg)
            }
        }

        try {
            const { data } = await browser.executeTabFunction({ payload: payload })
            msg.tabFunctionResult = data
            this.setStatus("SUCCESS", 'Done')
            return msg
        } catch (e) {
            this.setStatus('ERROR', `Error: ${e.message}`)
            msg.__error = e
            msg.__isError = true
            return msg
        }

    }
}

module.exports = MayaBrowserTabFunction