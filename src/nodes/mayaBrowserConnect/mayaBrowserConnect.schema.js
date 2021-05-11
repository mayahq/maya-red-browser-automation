const { Node, Schema } = require('@mayahq/module-sdk')

class Connect extends Node {
    static schema = new Schema({
        name: 'maya-browser-connect',
        category: 'config',
        label: 'Browser Connection',
        isConfig: true,
        exportable: false,
        fields: {},
        redOpts: {
            credentials: {
                secretKey: { type: String }
            }
        }
    })
}

module.exports = Connect