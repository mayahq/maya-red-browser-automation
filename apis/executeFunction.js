const Page = require('./utils/page')

module.exports = function (RED) {
    function MayaBrowserExecuteFunction(config) {
        RED.nodes.createNode(this, config);

        this.selector = config.selector;
        this.payloadTypeSelector = config.payloadTypeSelector;
        this.timeout = config.timeout;
        this.selectorType = config.selectorType;
        this.tabId = config.tabId;
        this.payloadTypeTabId = config.payloadTypeTabId;
        this.func = config.func;
        this.payloadTypeFunc = config.payloadTypeFunc;
        this.args = config.args;
        this.payloadTypeArgs = config.payloadTypeArgs;
        this.credentials = RED.nodes.getCredentials(config.connection);

        var node = this;

        // Retrieve the config node
        this.on("input", async function (msg) {
            console.log('CLICKED', node.selector)
            node.status({
                fill: "yellow",
                shape: "dot",
                text: "executing...",
            });

            async function getValue(value, valueType, msg) {
                return new Promise(function (resolve, reject) {
                    if (valueType === "str") {
                        resolve(value);
                    } else {
                        console.log(value, valueType, this, msg)
                        RED.util.evaluateNodeProperty(value, valueType, this, msg, function (
                            err,
                            res
                        ) {
                            if (err) {
                                console.log("ohno")
                                node.error(err.msg);
                                reject(err.msg);
                            } else {
                                resolve(res);
                            }
                        });
                    }
                });
            }

            function cleanArgs(args) {
                let error = false
                if (typeof args === 'string') {
                    try {
                        const structuredArgs = JSON.parse(args)
                        return structuredArgs
                    } catch (e) {
                        error = true
                    }
                } else if (typeof args === 'object' && Array.isArray(args)) {
                    return args
                } else {
                    error = true
                }

                if (error) {
                    node.status({
                        fill: "red",
                        shape: "ring",
                        text: "Unsupported argument format",
                    });
                    throw new Error("Unsupported argument format")
                }
            }


            let selector = await getValue(
                this.selector,
                this.payloadTypeSelector,
                msg
            );
            let tabId = await getValue(
                this.tabId,
                this.payloadTypeTabId,
                msg
            );
            let func = await getValue(
                this.func,
                this.payloadTypeFunc,
                msg
            );
            let args = await getValue(
                this.args,
                this.payloadTypeArgs,
                msg
            )
            args = cleanArgs(args)
            console.log('tabId', tabId)

            const page = new Page(this.credentials.secretKey)
            page.executeFunction({
                    selector,
                    func,
                    args,
                    tabId,
                    timeout: this.timeout
                })
                .then(() => {
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
    RED.nodes.registerType("maya-browser-execute-function", MayaBrowserExecuteFunction);
};
