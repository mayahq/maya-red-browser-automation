const api = require('./api')
const { v4: uuidv4 } = require("uuid");

class Page {
    constructor(secretKey) {
        this.id = uuidv4();
        this.secretKey = secretKey
    }

    click({ selectorType, selector, timeout, tabId = null }) {
        return new Promise((resolve, reject) => {
            const data = {
                type: "click",
                payload: {
                    selector: selector,
                    selectorType: selectorType || "querySelector",
                    tabId: tabId
                },
                timeout: timeout || 1000,
            }
            api.post(this.secretKey, data)
                .then((result) => {
                    console.log("Click:", result.data);
                    resolve(result);
                })
                .catch(({ response }) => {
                    reject(response);
                });
        });
    }

    type({ selectorType, selector, content, timeout, tabId }) {
        return new Promise((resolve, reject) => {
            const data = {
                type: "type",
                payload: {
                    selector: selector,
                    selectorType: selectorType || "querySelector",
                    text: content,
                    tabId: tabId
                },
                timeout: timeout || 1000,
            }
            api.post(this.secretKey, data)
                .then((result) => {
                    console.log("Type:", result.data);
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
                },
                timeout: timeout || 1000,
            }
            api.post(this.secretKey, data)
                .then((result) => {
                    console.log("Prompt:", result.data);
                    resolve(result);
                })
                .catch(({ response }) => {
                    reject(response);
                });
        });
    }

    navigate({ tabId, url, timeout }) {
        return new Promise((resolve, reject) => {
            const payload = { url }
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
                    console.log('Navigate:', result.data)
                    resolve(result)
                })
                .catch(({ response }) => {
                    reject(response)
                })
        })
    }

    executeFunction({ selector, func, args, tabId, timeout = 2000 }) {
        console.log('TAB ID', tabId)
        return new Promise((resolve, reject) => {
            const payload = { selector, func, args, tabId }
            console.log(payload)
            const data = {
                type: "executeFunction",
                payload: payload,
                timeout: timeout
            }
            api.post(this.secretKey, data)
                .then((result) => {
                    console.log('ExecuteFunction:', result.data)
                    resolve(result)
                })
                .catch((e) => reject(e))
        })
    }
}

module.exports = Page