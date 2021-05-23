module.exports = function (RED) {
	"use strict";
  const Page = require('../../utils/page');
  const { getValue } = require("../../utils/getValue");
	function MayaBrowserQuery(config) {
    // Scrape Node for Maya Red Web Automation
		RED.nodes.createNode(this, config);
		this.options = config.options;
    this.tabId = config.tabId;
    this.payloadTypeTabId = config.payloadTypeTabId;
    this.timeout = config.timeout;
    this.payloadTypeTimeout = config.payloadTypeTimeout;
    this.credentials = RED.nodes.getCredentials(config.session);
    const node = this;

    this.on("input", async function (msg) {
      const { secretKey } = this.credentials;
      const page = new Page(secretKey);
      let tabId = await getValue(this.tabId, this.payloadTypeTabId, msg, RED);
      let timeout = await getValue(this.timeout, this.payloadTypeTimeout, msg, RED);
      let query = {};
      this.options.forEach(q => {
        query[q["key"]] = [q["xpath"] + q["extract"]];
      });
      let payload = {
        query,
        tabId,
        timeout
      }
      try {
        console.log("Input payload:", payload);
        const res = await page.scrape(payload)
        if (res.data.status === 'ERROR') {
            const error = res.data.error
            node.status({
              fill: "red",
              shape: "ring",
              text: "error: " + JSON.stringify(error),
            });
            msg.error = error
            msg.isError = true
            console.error("Error in scraping", msg.error);
            node.send(msg)
        } else {
          node.status({
            fill: "green",
            shape: "dot",
            text: "Query successful",
          });
          msg.result = res.data
          node.send(msg);
        }
        console.log(msg.results);
      } catch (err) {
        node.error(err);
        node.status({
          fill: "red",
          shape: "ring",
          text: "error",
        });
        msg.error = err
        msg.isError = true
        node.send(msg)
      }
      
    });
	}
	RED.nodes.registerType("maya-browser-query", MayaBrowserQuery);
};
