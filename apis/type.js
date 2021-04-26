const Page = require('./utils/page')

module.exports = function (RED) {
  function MayaBrowserType(config) {
    RED.nodes.createNode(this, config);
    this.selector = config.selector;
    this.payloadTypeSelector = config.payloadTypeSelector;
    this.content = config.content;
    this.payloadTypeContent = config.payloadTypeContent;
    this.timeout = config.timeout;
    this.selectorType = config.selectorType;
    this.tabId = config.tabId;
    this.payloadTypeTabId = config.payloadTypeTabId;
    this.credentials = RED.nodes.getCredentials(config.connection);
    this.index = config.index;
    this.payloadTypeIndex = config.payloadTypeIndex;

    var node = this;

    async function getValue(value, valueType, msg) {
      return new Promise(function (resolve, reject) {
        if (valueType === "str") {
          resolve(value);
        } else {
          RED.util.evaluateNodeProperty(value, valueType, this, msg, function (
            err,
            res
          ) {
            if (err) {
              node.error(err.msg);
              reject(err.msg);
            } else {
              resolve(res);
            }
          });
        }
      });
    }
    // Retrieve the config node
    this.on("input", async function (msg) {
      node.status({
        fill: "yellow",
        shape: "dot",
        text: "typing ..."
      });

      let selector = await getValue(this.selector, this.payloadTypeSelector, msg);
      let content = await getValue(this.content, this.payloadTypeContent, msg);
      let tabId = await getValue(this.tabId, this.payloadTypeTabId, msg);
      let index = await getValue(this.index, this.payloadTypeIndex, msg);
      index = parseInt(index)
      if (!index) {
        index = 0
      }

      const opts = {
        selectorType: this.selectorType,
        selector,
        index,
        content,
        timeout: this.timeout
      }

      if (tabId) {
        opts.tabId = tabId
      }

      const page = new Page(this.credentials.secretKey)
      page.type(opts)
        .then(async () => {
          node.send(msg);
          node.status({
            fill: "green",
            shape: "dot",
            text: "completed"
          });
        })
        .catch(err => {
          node.error(err);
          node.status({
            fill: "red",
            shape: "ring",
            text: "error: " + err.toString().substring(0, 10) + "..."
          });
        });
    });
    oneditprepare: function oneditprepare() {
      $("#node-input-name").val(this.name);
    }
  }
  RED.nodes.registerType("maya-browser-type", MayaBrowserType);
};
