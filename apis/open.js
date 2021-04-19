const Browser = require('./utils/browser')

module.exports = function (RED) {
  function MayaBrowserOpen(config) {
    RED.nodes.createNode(this, config);
    this.url = config.url;
    this.payloadTypeUrl = config.payloadTypeUrl;
    this.credentials = RED.nodes.getCredentials(config.connection);
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
          "going to: " + node.url !== ""
            ? node.url.toString().substring(0, 15)
            : msg.url.toString().substring(0, 15) + "...",
      });
      const browser = new Browser(this.credentials.secretKey)
      let url = await getValue(this.url, this.payloadTypeUrl, msg);
      browser
        .open(url)
        .then((res) => {
          msg.openedTab = res.data.tab;
          node.send(msg);
          node.status({
            fill: "green",
            shape: "dot",
            text: "completed",
          });
        })
        .catch((err) => {
          node.error(err);
          node.status({
            fill: "red",
            shape: "ring",
            text: "error: " + err.toString().substring(0, 10) + "...",
          });
        });
    });
    oneditprepare: function oneditprepare() {
      $("#node-input-name").val(this.name);
    }
  }
  RED.nodes.registerType("maya-browser-open", MayaBrowserOpen);
};
