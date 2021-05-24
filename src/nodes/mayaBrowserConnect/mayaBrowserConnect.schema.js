const { Node, Schema, fields } = require('@mayahq/module-sdk')

class Connect extends Node {
    constructor(node, RED) {
        super(node, RED)
    }

    static schema = new Schema({
        name: 'maya-browser-connect',
        category: 'config',
        label: 'Browser Connection',
        isConfig: true,
        isProfileConfigNode: true,
        exportable: false,
        fields: {},
        redOpts: {
            credentials: {
                secretKey: new fields.Credential({ type: 'str', password: true })
            }
        }
    })
}

module.exports = Connect