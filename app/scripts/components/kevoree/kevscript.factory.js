angular.module('browserApp')
  .factory('kScript', function (GROUP_NAME, MASTER_NODE_NAME, MASTER_NODE_IP, MASTER_GROUP_PORT) {
    var kevs = new KevoreeKevscript();

    return {
      parse: kevs.parse,
      parseModel: kevs.parseModel,
      defaultModel: function (runtime) {
        runtime.groupName       = runtime.groupName       || GROUP_NAME;
        runtime.masterNodeName  = runtime.masterNodeName  || MASTER_NODE_NAME;
        runtime.masterGroupPort = runtime.masterGroupPort || MASTER_GROUP_PORT;
        runtime.masterNodeIP    = runtime.masterNodeIP    || MASTER_NODE_IP;

        var template =
          'add {nodeName}, {masterNodeName}: JavascriptNode' + '\n' +
          'add {groupName}: WSGroup' + '\n' +
          '\n' +
          'attach {nodeName} {groupName}' + '\n' +
          '\n' +
          'set {groupName}.master = "{masterNodeName}"' + '\n' +
          'set {groupName}.port/{masterNodeName} = "{masterGroupPort}"' + '\n' +
          '\n' +
          'network {masterNodeName}.net.ip {masterNodeIP}' + '\n';

        return template
          .replace(/{nodeName}/g, runtime.nodeName)
          .replace(/{groupName}/g, runtime.groupName)
          .replace(/{masterNodeName}/g, runtime.masterNodeName)
          .replace(/{masterGroupPort}/g, runtime.masterGroupPort)
          .replace(/{masterNodeIP}/g, runtime.masterNodeIP);
      }
    };
  });
