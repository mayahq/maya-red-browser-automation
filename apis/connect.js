const controlServer = process.env.BROWSER_CONTROL ? process.env.BROWSER_CONTROL : "http://localhost:8080";

const APIFetch = require("./utils/api");
const { v4: uuidv4 } = require("uuid");
const { Resolver } = require("dns");

class BrowserPage {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.id = uuidv4();
  }

  async goto(url, timeout) {
    return new Promise((resolve, reject) => {
      APIFetch(this.serverUrl + "/api", "post", {
        type: "goto",
        payload: { url: url },
        timeout: timeout || 2000,
      })
        .then((result) => {
          console.log("Goto:", result.data);
          resolve(result);
        })
        .catch(({ response }) => {
          reject(response);
        });
    });
  }

  async click({ selectorType, selector, timeout, tabId = null }) {
    return new Promise((resolve, reject) => {
      APIFetch(this.serverUrl + "/api", "post", {
        type: "click",
        payload: {
          selector: selector,
          selectorType: selectorType || "querySelector",
          tabId: tabId
        },
        timeout: timeout || 1000,
      })
        .then((result) => {
          console.log("Click:", result.data);
          resolve(result);
        })
        .catch(({ response }) => {
          reject(response);
        });
    });
  }

  async type(selectorType, selector, text, timeout) {
    return new Promise((resolve, reject) => {
      APIFetch(this.serverUrl + "/api", "post", {
        type: "type",
        payload: {
          selector: selector,
          selectorType: selectorType || "querySelector",
          text: text,
        },
        timeout: timeout || 1000,
      })
        .then((result) => {
          console.log("Type:", result.data);
          resolve(result);
        })
        .catch(({ response }) => {
          reject(response);
        });
    });
  }

  async prompt(selectorType, selector, prompt, event, timeout) {
    return new Promise((resolve, reject) => {
      APIFetch(this.serverUrl + "/api", "post", {
        type: "prompt",
        payload: {
          selector: selector,
          selectorType: selectorType || "querySelector",
          prompt,
          event,
        },
        timeout: timeout || 1000,
      })
        .then((result) => {
          console.log("Prompt:", result.data);
          resolve(result);
        })
        .catch(({ response }) => {
          reject(response);
        });
    });
  }
}

class Browser {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.id = uuidv4();
  }
  async newPage() {
    return new BrowserPage(this.serverUrl);
  }

  async goto(url, timeout) {
    return new Promise((resolve, reject) => {
      APIFetch(this.serverUrl + "/api", "post", {
        type: "goto",
        payload: { url: url },
        timeout: timeout || 2000,
      })
        .then((result) => {
          console.log("Goto:", result.data);
          resolve(result);
        })
        .catch(({ response }) => {
          reject(response);
        });
    });
  }

  async findTab(query, timeout) {
    return new Promise((resolve, reject) => {
      APIFetch(this.serverUrl + "/api", "post", {
        type: "findTab",
        payload: { query },
        timeout: timeout || 2000
      })
        .then((result) => {
          console.log("FindTab:", result.data)
          resolve(result)
        })
        .catch(({ response }) => {
          reject(response)
        })
    })
  }

  async navigate({ tabId, url, timeout }) {
    return new Promise((resolve, reject) => {
      const payload = { url }
      if (tabId) {
        payload.tabId = tabId
      }

      APIFetch(this.serverUrl + "/api", "post", {
        type: "navigate",
        payload: payload,
        timeout: timeout || 2000
      })
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

class MayaClient {
  constructor() {
    this.serverUrl = null;
  }
  async launch(serverUrl) {
    this.serverUrl = serverUrl;
    // return new Browser(serverUrl);
    return new Promise((resolve, reject) => {
      APIFetch(this.serverUrl + "/api", "post", {
        type: "launch",
      })
        .then((result) => {
          console.log("Launch", result.data);
          if (result.data.status === "running") {
            let browser = new Browser(serverUrl);
            resolve(browser);
          } else {
            reject("Browser not available at ", serverUrl);
          }
        })
        .catch(({ response }) => {
          reject(response);
        });
    });
  }
};

let maya = new MayaClient()

module.exports = function (RED) {
  function MayaBrowserConnect(config) {
    RED.nodes.createNode(this, config);
    this.name = config.name;
    this.timeout = config.timeout;
    var node = this;
    node.status({
      fill: "red",
      shape: "dot",
      text: "not launched",
    });

    // Retrieve the config node
    this.on("input", function (msg) {
      node.status({
        fill: "yellow",
        shape: "dot",
        text: "launching",
      });
      var globalContext = this.context().global;
      var checkMaya = globalContext.get("maya");
      if (checkMaya) {
        // checkPuppeteer.browser.close();
        globalContext.set("maya", { browser: checkMaya.browser });
        node.send(msg);
        node.status({
          fill: "green",
          shape: "dot",
          text: "connected",
        });
      } else {
        maya
          .launch(controlServer, this.timeout)
          .then(async (browser) => {
            browser.page = await browser.newPage();
            await globalContext.set("maya", { browser });
            node.send(msg);
            node.status({
              fill: "green",
              shape: "dot",
              text: "connected",
            });
          })
          .catch((err) => {
            this.log(err);
            node.status({
              fill: "red",
              shape: "ring",
              text: "error: " + err.toString().substring(0, 10) + "...",
            });
          });
      }
    });
  }
  RED.nodes.registerType("maya-browser-connect", MayaBrowserConnect);
};
