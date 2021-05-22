module.exports = function (RED) {
	"use strict";
  const Page = require('../../utils/page');
  const { getValue } = require("../../utils/getValue");
	function MayaBrowserQuery(config) {
		RED.nodes.createNode(this, config);
		this.options = config.options;
    this.tabId = config.tabId;
    this.payloadTypeTabId = config.payloadTypeTabId;
    this.timeout = config.timeout;
    this.payloadTypeTimeout = config.payloadTypeTimeout;
    this.credentials = RED.nodes.getCredentials(config.session);
    const node = this;

    this.on("input", async function (msg) {
      const { secretKey } = this.credentials.connection
      const page = new Page(secretKey);
      let tabId = getValue(this.tabId, this.payloadTypeTabId, msg, RED);
      let timeout = getValue(this.timeout, this.payloadTypeTimeout, msg, RED);
      let results;
      let query = this.options.map(q => {
        let queryObj = {}
        queryObj[q[key]] = q.xpath;
        return queryObj;
      });
      let payload = {
        query,
        tabId,
        timeout
      }
      try {
        results =  await page.scrape(payload);
        msg.results = results;
      } catch (e) {
          this.setStatus('ERROR', e.toString().substring(0, 10) + '...')
          msg.error = e
          msg.isError = true
      }
      node.send(msg);
    });
	}
	RED.nodes.registerType("maya-browser-query", MayaBrowserQuery);
};
