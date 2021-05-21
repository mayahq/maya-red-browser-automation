module.exports = function (RED) {
  "use strict";

  function MayaBrowserQuery(config) {
    RED.nodes.createNode(this, config);
  }
  RED.nodes.registerType("maya-browser-query", MayaBrowserQuery);
}
