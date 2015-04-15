angular.module('browserApp')
    .factory('kScript', function ($rootScope, Notification, storage, GROUP_NAME, WS_HOST, WS_PORT) {
        var KEY = 'kevs.';
        function CacheManager() {}
        CacheManager.prototype.get = function (key) {
            return storage.get(KEY+key);
        };
        CacheManager.prototype.add = CacheManager.prototype.put = function (key, value) {
            storage.set(KEY+key, value);
        };
        CacheManager.prototype.remove = CacheManager.prototype.delete = function (key) {
            storage.remove(KEY+key);
        };
        CacheManager.prototype.getAll = function () {
            var ret = [];
            storage.keys().forEach(function (key) {
                if (key.slice(0, KEY.length) === KEY) {
                    ret.push(storage.get(key));
                }
            });
            return ret;
        };
        CacheManager.prototype.clear = function () {
            storage.keys().forEach(function (key) {
                if (key.slice(0, KEY.length) === KEY) {
                    storage.remove(key);
                }
            }.bind(this));
            Notification.success({
                title: 'KevScript cache',
                message: 'Cleared successfully',
                delay: 3000
            });
        };

        var kevs = new KevoreeKevscript(new CacheManager());
        kevs.content = null;
        kevs.DEV_MODE_TEMPLATE =
            '//==========================================//' + '\n' +
            '// Default dev-mode KevScript file          //' + '\n' +
            '// Feel free to edit it to suit your needs  //' + '\n' +
            '//==========================================//' + '\n' +
            '\n' +
            'add node0, browser: JavascriptNode' + '\n' +
            'add sync: WSGroup' + '\n' +
            '\n' +
            'attach node0, browser sync'+ '\n' +
            'set sync.master = "node0"' + '\n' +
            '\n' +
            'network node0.ip.lo 127.0.0.1' + '\n';
        kevs.DEFAULT_TEMPLATE =
            '//==========================================//' + '\n' +
            '// This is a default KevScript file         //' + '\n' +
            '// Feel free to edit it to suit your needs  //' + '\n' +
            '//==========================================//' + '\n' +
            '\n' +
            '// this node platform' + '\n' +
            'add {nodeName}: JavascriptNode' + '\n' +
            '// add a RemoteWSGroup to be able to manipulate the model from external tools' + '\n' +
            'add {groupName}: RemoteWSGroup' + '\n' +
            '\n' +
            '// add this node to the group' + '\n' +
            'attach {nodeName} {groupName}' + '\n' +
            '\n' +
            '// use a public WebSocket broker' + '\n' +
            'set {groupName}.host = "{host}"' + '\n' +
            'set {groupName}.port = "{port}"' + '\n' +
            '// use a randomly generated ID to prevent conflicts with others' + '\n' +
            'set {groupName}.path = "{path}"\n';

        kevs.defaultModel = function (runtime) {
            runtime = runtime || {};
            runtime.groupName = runtime.groupName || GROUP_NAME;
            runtime.host      = runtime.ws_host   || WS_HOST;
            runtime.port      = runtime.ws_port   || WS_PORT;
            runtime.path      = runtime.ws_path   || $rootScope.APP_ID;

            return kevs.DEFAULT_TEMPLATE
                .replace(/{nodeName}/g, runtime.nodeName)
                .replace(/{groupName}/g, runtime.groupName)
                .replace(/{host}/g, runtime.host)
                .replace(/{port}/g, runtime.port)
                .replace(/{path}/g, runtime.path);
        };

        return kevs;
    });
