const api = require('./api')
const { v4: uuidv4 } = require("uuid");

class Browser {
    constructor() {
        this.id = uuidv4();
    }

    open(url, timeout = 2000) {
        return new Promise((resolve, reject) => {
            const data = {
                type: "goto",
                payload: { url: url },
                timeout: timeout,
            }
            api.post('/', data)
                .then((result) => {
                    resolve(result.data);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    findTab({ query, timeout = 2000 }) {
        return new Promise((resolve, reject) => {
            const data = {
                type: "findTab",
                payload: { query },
                timeout: timeout
            }
            api.post('/', data)
                .then((result) => {
                    console.log("FindTab:", result.data)
                    resolve(result)
                })
                .catch(({ response }) => {
                    reject(response)
                })
        })
    }

    close({ timeout, closeOpts }) {
        return new Promise((resolve, reject) => {
            const data = {
                type: "closeTabs",
                payload: { closeOpts },
                timeout: timeout || 2000
            }
            api.post('/', data)
                .then((result) => {
                    console.log('CloseTab:', result.data)
                    resolve(result)
                })
                .catch((e) => {
                    reject(e)
                })
        })
    }
}

module.exports = Browser