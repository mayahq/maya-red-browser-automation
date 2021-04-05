const api = require('./api')
const { v4: uuidv4 } = require("uuid");

class Page {
    constructor() {
        this.id = uuidv4();
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
            api.post('/', data)
                .then((result) => {
                    console.log("Click:", result.data);
                    resolve(result);
                })
                .catch(({ response }) => {
                    reject(response);
                });
        });
    }

    type({ selectorType, selector, text, timeout, tabId }) {
        return new Promise((resolve, reject) => {
            const data = {
                type: "type",
                payload: {
                    selector: selector,
                    selectorType: selectorType || "querySelector",
                    text: text,
                    tabId: tabId
                },
                timeout: timeout || 1000,
            }
            api.post('/', data)
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
            api.post('/', data)
                .then((result) => {
                    console.log("Prompt:", result.data);
                    resolve(result);
                })
                .catch(({ response }) => {
                    reject(response);
                });
        });
    }

    async navigate({ tabId, url, timeout }) {
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
            api.post('/', data)
                .then((result) => {
                    console.log('Navigate:', result.data)
                    resolve(result)
                })
                .catch(({ response }) => {
                    reject(response)
                })
        })
    }
}

module.exports = Page