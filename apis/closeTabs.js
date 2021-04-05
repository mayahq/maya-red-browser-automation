const Page = require('./utils/page')
const Browser = require('./utils/browser')

module.exports = function (RED) {
  function MayaBrowserCloseTabs(config) {
    RED.nodes.createNode(this, config);
    this.timeout = config.timeout;
    this.tabId = config.tabId;
    this.payloadTypeTabId = config.payloadTypeTabId;
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

    function getCloseOpts(tabIds) {
        let tabIdList
        if (typeof tabIds === 'string') {
            tabIdList = tabIds.split(',')
        } else if (typeof tabIds === 'object' && Array.isArray(tabIds)) {
            tabIdList = tabIds
        } else {
          if (typeof tabIds === 'object') {
            if ((tabIds.close && !tabIds.keep) ||
                (!tabIds.close && tabIds.keep)) {
              return tabIds
            } else {
              delete tabIds['close']
              return tabIds
            }
          }
        }

        let tabIdOpts = {}
        if (tabIdList.some((id) => parseInt(id) < 0)) {
            tabIdOpts.keep = []
            tabIds.forEach((id) => {
                const numId = parseInt(id)
                if (numId < 0) {
                    tabIdOpts.keep.push(numId * -1)
                }
            })
        } else {
            tabIdOpts.close = []
            tabIds.forEach((id) => {
                const numId = parseInt(id)
                if (numId > 0) {
                    tabIdOpts.close.push(numId)
                }
            })
        }

        return tabIdOpts
    }
    // Retrieve the config node
    this.on("input", async function (msg) {
      node.status({
        fill: "yellow",
        shape: "dot",
        text: "typing ..."
      });

      let tabIds = await getValue(this.tabId, this.payloadTypeTabId, msg);
      const closeOpts = getCloseOpts(tabIds)

      const browser = new Browser()
      browser.close({
          timeout: this.timeout,
          closeOpts: closeOpts
      })
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
  RED.nodes.registerType("maya-browser-close-tabs", MayaBrowserCloseTabs);
};
