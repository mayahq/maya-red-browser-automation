const {
    Node,
    Schema
} = require('@mayahq/module-sdk')

class MayaBrowserQuery extends Node {
    static schema = new Schema({
        name: 'maya-browser-query',
        category: 'maya-browser-automation',
        isConfig: false,
        fields: {
            selectType: 
        },

    })

    onInit() {
        // Do something on initialization of node
    }

    async onMessage(msg, vals) {
        // Handle the message. The returned value will
        // be sent as the message to any further nodes.

    }
}

module.exports = MayaBrowserQuery