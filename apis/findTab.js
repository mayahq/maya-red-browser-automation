const Browser = require('./utils/browser')

module.exports = function (RED) {
    function MayaBrowserFindTab(config) {

      RED.nodes.createNode(this, config);
      this.query = config.query;
      this.payloadTypeQuery = config.payloadTypeQuery;
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
          text:
            "finding..."
        });
        let query = await getValue(this.query, this.payloadTypeQuery, msg);
        if (typeof query === 'string') {
          query = JSON.stringify(query)
        }
        
        const browser = new Browser()
        browser.findTab({ query })
            .then((result) => {
                const { data } = result
                msg.tabsFound = data.tabs;
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
    RED.nodes.registerType("maya-browser-find-tab", MayaBrowserFindTab);
  };
  