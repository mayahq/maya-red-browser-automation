const { Node, Schema, fields } = require('@mayahq/module-sdk')

class Connect extends Node {
    constructor(node, RED, opts) {
        super(node, RED, {...opts})
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
        },
        icon: "white-globe.svg"
    })
}

module.exports = Connect