const { isNullOrUndefined } = require('util');

module.exports = function (RED) {
    'use strict'
    function MayaBrowserConnect(config) { 
        // the config information needs a runtime API to be set as creds
        var crypto = require('crypto');
        var localUserCache = {};
        RED.nodes.createNode(this, config);

        this.name = config.name === "" || isNullOrUndefined(config.name)? "maya-browser-connect" : config.name;
        if (this.credentials.secretKey) {
            this.oauth = {
                secretKey: this.credentials.secretKey
            }
            this.credHash = crypto.createHash('sha1').update(this.credentials.secretKey).digest('base64');
            var self = this;
            localUserCache[self.credHash] = config.name;
            if (localUserCache.hasOwnProperty(self.credHash)) {
                this.localIdentityPromise = Promise.resolve(localUserCache[self.credHash]);
            } else {
                self.warn("Failed to Connect to browser");
            }
        }
    }

    RED.nodes.registerType('maya-browser-connect', MayaBrowserConnect, {
        credentials: {
            secretKey: {
                type: String
            }
        }
    });
}
