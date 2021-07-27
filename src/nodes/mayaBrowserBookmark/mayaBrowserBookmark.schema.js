const {
    Node,
    Schema,
    fields
} = require('@mayahq/module-sdk')

const Connect = require('../mayaBrowserConnect/mayaBrowserConnect.schema')
const Browser = require('../../utils/browser')

class MayaBrowserBookmark extends Node {
    constructor(node, RED) {
        super(node, RED)
    }

    static schema = new Schema({
        name: 'maya-browser-bookmark',
        label: 'Bookmark',
        category: 'Maya Browser Automation',
        isConfig: false,
        fields: {
            func: new fields.SelectFieldSet({
                fieldSets: {
                    getBookmark: {
                        parentId: new fields.Typed({
                            type: 'str',
                            allowedTypes: ['msg', 'flow', 'global'],
                            defaultVal: '-1'
                        }),
                    },
                    addBookmark: {
                        parent: new fields.Typed({
                            type: 'str',
                            allowedTypes: ['msg', 'flow', 'global'],
                            defaultVal: '-1'
                        }),
                        title: new fields.Typed({ 
                            type: 'str', 
                            allowedTypes: ['msg', 'flow', 'global'], 
                            defaultVal: 'New Bookmark' 
                        }),
                        url: new fields.Typed({ 
                            type: 'str', 
                            allowedTypes: ['msg', 'flow', 'global'], 
                            defaultVal: 'https://www.google.com' 
                        })
                    },
                    removeBookmark: {
                        bookmarkId: new fields.Typed({ 
                            type: 'str', 
                            allowedTypes: ['msg', 'flow', 'global'], 
                            defaultVal: '-1', 
                            displayName: 'Bookmark ID'
                        })
                    },
                    getBookmarkFolders: {}
                }
            }),
            session: new fields.ConfigNode({ type: Connect })
        },

    })

    onInit() {
        // Do something on initialization of node
    }

    async onMessage(msg, vals) {
        if (msg.isError) {
            return msg
        }

        const { secretKey } = this.credentials.session
        const browser = new Browser(secretKey)

        try {
            if (vals.func.selected === 'getBookmark') {

                this.setStatus('PROGRESS', 'Fetching bookmarks...')
                let { parentId } = vals.func.childValues
                if (parseInt(parentId) < 0) {
                    parentId = null
                }
                const { data } = await browser.getBookmarks({ parentId })
                
                if (data.status === 'ERROR') {
                    msg.error = data.error
                    msg.isError = true
                    this.setStatus('ERROR', data.error.description)
                    return msg
                }
    
                msg.bookmarks = data.bookmarks
                this.setStatus('SUCCESS', 'Fetched')
                return msg
    
            } 
            else if (vals.func.selected === 'addBookmark') {

                this.setStatus('PROGRESS', 'Adding bookmark...')
                const { parent, title, url } = vals.func.childValues
                const { data } = await browser.addBookmark({ title, url, parentId: parent })
    
                if (data.status === 'ERROR') {
                    msg.error = data.error
                    msg.isError = true
                    this.setStatus('ERROR', data.error.description)
                    return msg
                }
    
                msg.bookmarkId = data.bookmarkId
                this.setStatus('SUCCESS', 'Added')
                return msg

            }
            else if (vals.func.selected === 'removeBookmark') {
                this.setStatus('PROGRESS', 'Removing bookmark...')
                const { bookmarkId } = vals.func.childValues
                const { data } = await browser.removeBookmark({ bookmarkId })
    
                if (data.status === 'ERROR') {
                    msg.error = data.error
                    msg.isError = true
                    this.setStatus('ERROR', data.error.description)
                    return msg
                }
    
                msg.bookmarkId = data.bookmarkId
                this.setStatus('SUCCESS', 'Removed')
                return msg
            }
            else if (vals.func.selected === 'getBookmarkFolders') {

                this.setStatus('PROGRESS', 'Fetching bookmark folders...')
                const { data } = await browser.getBookmarkFolders()
                
                if (data.status === 'ERROR') {
                    msg.error = data.error
                    msg.isError = true
                    this.setStatus('ERROR', data.error.description)
                    return msg
                }
    
                msg.bookmarkFolders = data.folders
                this.setStatus('SUCCESS', 'Fetched')
                return msg
            }   
        } catch (e) {
            msg.error = e
            msg.isError = true
            this.setStatus('ERROR', `Unknown error: ${e.toString()}`)
            return msg
        }
    }
}

module.exports = MayaBrowserBookmark