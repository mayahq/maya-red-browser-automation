module.exports = function (RED) {
	"use strict";
	const Page = require("../../utils/page");
	const { getValue } = require("../../utils/getValue");
	const jsonata = require("jsonata");
	function MayaBrowserQuery(config) {
		// Scrape Node for Maya Red Web Automation
		RED.nodes.createNode(this, config);
		this.options = config.options;
		this.tabId = config.tabId;
		this.payloadTypeTabId = config.payloadTypeTabId;
		this.timeout = config.timeout;
		this.payloadTypeTimeout = config.payloadTypeTimeout;
		this.credentials = RED.nodes.getCredentials(config.session);
		this.mergeOutputs = config.mergeOutputs;
		const node = this;

		this.on("input", async function (msg) {
			const { secretKey } = this.credentials;
			const page = new Page(secretKey);
			let tabId = await getValue(this.tabId, this.payloadTypeTabId, msg, RED);
			let timeout = await getValue(
				this.timeout,
				this.payloadTypeTimeout,
				msg,
				RED
			);
			let query = {};
			this.options.forEach((q) => {
				query[q["key"]] = [q["xpath"] + q["extract"]];
			});
			let payload = {
				query,
				tabId,
				timeout,
			};
			try {
				console.log("Input payload:", payload);
				const res = await page.scrape(payload);
				if (res.data.status === "ERROR") {
					const error = res.data.error;
					node.status({
						fill: "red",
						shape: "ring",
						text: "error: " + JSON.stringify(error),
					});
					msg.error = error;
					msg.isError = true;
					console.error("Error in scraping", msg.error);
					node.send(msg);
				} else {
					node.status({
						fill: "green",
						shape: "dot",
						text: "Query successful",
					});
					if (this.mergeOutputs) {
						const initialData = res.data.data;
						let listOkeys = Object.keys(initialData);
						let zipArgs = "";
						let objectArg = "";
						let count = 0;
						listOkeys.forEach((key) => {
							zipArgs += `$.${key}, `;
							objectArg += `"${key}":$x[${count}],`;
							count++;
						});
						zipArgs = zipArgs.slice(0, -2);
						try {
							let expression =
								`$map($zip(${zipArgs}), function($x, $i, $a) {
                {
                    ${objectArg.slice(0, -1)}
                    }
              })`
              console.log("final jsonat:", expression);
              let jsonataExp = jsonata(expression);
							msg.result = jsonataExp.evaluate(res.data.data);
							node.send(msg);
						} catch (error) {
							msg.error = error;
							msg.isError = true;
							console.error("Error in merging", msg.error);
							node.send(msg);
						}
					} else {
						msg.result = res.data.data;
						node.send(msg);
					}
				}
				console.log(msg.results);
			} catch (err) {
				node.error(err);
				node.status({
					fill: "red",
					shape: "ring",
					text: "error: " + err,
				});
				msg.error = err;
				msg.isError = true;
				node.send(msg);
			}
		});
	}
	RED.nodes.registerType("maya-browser-query", MayaBrowserQuery);
};
