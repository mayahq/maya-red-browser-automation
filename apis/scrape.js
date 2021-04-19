const Page = require('./utils/page')

module.exports = function (RED) {
	function MayaBrowserScrape(config) {
		RED.nodes.createNode(this, config);

		this.query = config.query;
		this.payloadTypeQuery = config.payloadTypeQuery;
		this.timeout = config.timeout;
		this.tabId = config.tabId;
		this.payloadTypeTabId = config.payloadTypeTabId;
		this.credentials = RED.nodes.getCredentials(config.connection);

		var node = this;

		// Retrieve the config node
		this.on("input", async function (msg) {
			node.status({
				fill: "yellow",
				shape: "dot",
				text: "scraping...",
			});

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

			var globalContext = this.context().global;
			let maya = globalContext.get("maya");
			const page = new Page(this.credentials.secretKey)

			let query = await getValue(
				this.query,
				this.payloadTypeQuery,
				msg
			)
			let tabId = await getValue(
				this.tabId,
				this.payloadTypeTabId,
				msg
			);

			page
				.scrape({
					query: query,
					timeout: this.timeout,
					tabId: tabId
				})
				.then((result) => {
					msg.result = result.data
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
	RED.nodes.registerType("maya-browser-scrape", MayaBrowserScrape);
};
