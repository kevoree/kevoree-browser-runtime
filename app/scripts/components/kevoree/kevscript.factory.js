angular.module('browserApp')
  .factory('kScript', function (GROUP_NAME, WS_HOST, WS_PORT, APP_ID) {
    var kevs = new KevoreeKevscript();

    return {
      parse: kevs.parse,
      parseModel: kevs.parseModel,
      defaultModel: function (runtime) {
        runtime.groupName = runtime.groupName || GROUP_NAME;
        runtime.host      = runtime.ws_host   || WS_HOST;
        runtime.port      = runtime.ws_port   || WS_PORT;
        runtime.path      = runtime.ws_path   || APP_ID;

        var template =
          'add {nodeName}: JavascriptNode' + '\n' +
          'add {groupName}: RemoteWSGroup' + '\n' +
          'attach {nodeName} {groupName}' + '\n' +
          'set {groupName}.host = "{host}"' + '\n' +
          'set {groupName}.port = "{port}"' + '\n' +
          'set {groupName}.path = "{path}"';

        return template
          .replace(/{nodeName}/g, runtime.nodeName)
          .replace(/{groupName}/g, runtime.groupName)
          .replace(/{host}/g, runtime.host)
          .replace(/{port}/g, runtime.port)
          .replace(/{path}/g, runtime.path);
      }
    };
  });
