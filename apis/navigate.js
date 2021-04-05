const { runInThisContext } = require("vm");

module.exports = function (RED) {
    function MayaBrowserNavigate(config) {

      RED.nodes.createNode(this, config);
      this.url = config.url;
      this.tabId = config.tabId;
      this.payloadTypeUrl = config.payloadTypeUrl;
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

      // Retrieve the config node
      this.on("input", async function (msg) {
        console.log('NAVIGATE', node)
        node.status({
          fill: "yellow",
          shape: "dot",
          text:
            "navigating to: " + node.url !== ""
              ? node.url.toString().substring(0, 15)
              : msg.url.toString().substring(0, 15) + "...",
        });
        var globalContext = this.context().global;
        let maya = globalContext.get("maya");

        let url = await getValue(this.url, this.payloadTypeUrl, msg);
        let tabId = await getValue(this.tabId, this.payloadTypeTabId, msg);
        
        const opts = { url }
        if (node.tabId) {
            opts.tabId = tabId
        }

        maya.browser.navigate(opts)
            .then(async (result) => {
                console.log('BRUH')
                await globalContext.set("maya", maya);
                node.send(msg);
                node.status({
                    fill: "green",
                    shape: "dot",
                    text: "complete"
                })
            })
            .catch((err) => {
                node.error(err);
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: `error: ${err.toString().substring(0, 10)}...`
                });
            });
      });
      oneditprepare: function oneditprepare() {
        $("#node-input-name").val(this.name);
      }
    }
    RED.nodes.registerType("maya-browser-navigate", MayaBrowserNavigate);
  };
  