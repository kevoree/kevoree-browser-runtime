angular.module('browserApp')
  .factory('kScript', function ($rootScope, Notification, GROUP_NAME, WS_HOST, WS_PORT) {
    var CACHE_APPENDIX = 'kevs_';
    function CacheManager() {
      this.cache = localStorage;
    }
    CacheManager.prototype.get = function (key) {
      return this.cache.getItem(CACHE_APPENDIX+key);
    };
    CacheManager.prototype.add = CacheManager.prototype.put = function (key, value) {
      this.cache.setItem(CACHE_APPENDIX+key, value);
    };
    CacheManager.prototype.remove = CacheManager.prototype.delete = function (key) {
      this.cache.removeItem(CACHE_APPENDIX+key);
    };
    CacheManager.prototype.getAll = function () {
      var ret = [];
      for (var i=0; i < this.cache.length; i++) {
        var key = this.cache.key(i);
        if (key.indexOf(CACHE_APPENDIX) === 0) {
          ret.push(this.get(key));
        }
      }
      return ret;
    };
    CacheManager.prototype.clear = function () {
      this.cache.clear();
      Notification.success({
        title: 'KevScript cache',
        message: 'Cleared successfully',
        delay: 3000
      });
    };

    var kevs = new KevoreeKevscript(new CacheManager());
    kevs.defaultModel = function (runtime) {
      runtime.groupName = runtime.groupName || GROUP_NAME;
      runtime.host      = runtime.ws_host   || WS_HOST;
      runtime.port      = runtime.ws_port   || WS_PORT;
      runtime.path      = runtime.ws_path   || $rootScope.APP_ID;

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
    };

    return kevs;
  });
