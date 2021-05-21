const api = require('./api')
const { v4: uuidv4 } = require("uuid");

class Page {
    constructor(secretKey) {
        this.id = uuidv4();
        this.secretKey = secretKey
    }

    click({ selectorType, selector, index = 0, timeout, tabId = null }) {
        return new Promise((resolve, reject) => {
            const data = {
                type: "click",
                payload: {
                    selector: selector,
                    selectorType: selectorType || "querySelector",
                    index: index,
                    tabId: tabId,
                    timeout: timeout || 1000,
                },
                timeout: timeout || 1000,
            }
            api.post(this.secretKey, data)
                .then((result) => {
                    resolve(result);
                })
                .catch(({ response }) => {
                    reject(response);
                });
        });
    }

    type({ selectorType, selector, index = 0, content, timeout, tabId }) {
        return new Promise((resolve, reject) => {
            const data = {
                type: "type",
                payload: {
                    selector: selector,
                    index: index,
                    selectorType: selectorType || "querySelector",
                    text: content,
                    tabId: tabId,
                    timeout: timeout || 1000,
                },
                timeout: timeout || 1000,
            }
            api.post(this.secretKey, data)
                .then((result) => {
                    resolve(result);
                })
                .catch(({ response }) => {
                    reject(response);
                });
        });
    }

    prompt(selectorType, selector, prompt, event, timeout) {
        return new Promise((resolve, reject) => {
            const data = {
                type: "prompt",
                payload: {
                    selector: selector,
                    selectorType: selectorType || "querySelector",
                    prompt,
                    event,
                    timeout: timeout || 1000,
                },
                timeout: timeout || 1000,
            }
            api.post(this.secretKey, data)
                .then((result) => {
                    resolve(result);
                })
                .catch(({ response }) => {
                    reject(response);
                });
        });
    }

    navigate({ tabId, url, timeout = 2000 }) {
        return new Promise((resolve, reject) => {
            const payload = { url, timeout }
            if (tabId) {
                payload.tabId = tabId
            }
            const data = {
                type: "navigate",
                payload: payload,
                timeout: timeout || 2000
            }
            api.post(this.secretKey, data)
                .then((result) => {
                    resolve(result)
                })
                .catch(({ response }) => {
                    reject(response)
                })
        })
    }

    executeFunction({ selector, func, args, tabId, timeout = 2000 }) {
        return new Promise((resolve, reject) => {
            const payload = { selector, func, args, tabId, timeout }
            const data = {
                type: "executeFunction",
                payload: payload,
                timeout: timeout
            }
            api.post(this.secretKey, data)
                .then((result) => {
                    resolve(result)
                })
                .catch((e) => reject(e))
        })
    }

    scrape({ query, tabId, timeout = 2000 }) {
        return new Promise((resolve, reject) => {
            const payload = { query, tabId, timeout }
            const data = {
                type: 'scrape',
                payload: payload,
                timeout: timeout
            }
            api.post(this.secretKey, data)
                .then((result) => {
                    resolve(result)
                })
                .catch((e) => reject(e))
        })
    }

    update({ tabId, updates, timeout }) {
        return new Promise((resolve, reject) => {
            const payload = { updates, tabId, timeout}
            const data = {
                type: 'updateTab',
                payload,
                timeout
            }
            api.post(this.secretKey, data)
                .then((result) => {
                    resolve(result.data)
                })
                .catch((e) => reject(e))
        })
    }
}

module.exports = Page