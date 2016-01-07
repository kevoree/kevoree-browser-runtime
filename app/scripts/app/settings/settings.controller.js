/**
 * @ngdoc function
 * @name browserApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the browserApp options page
 */
angular.module('browserApp')
  .controller('SettingsCtrl', function($scope, $timeout, kScript, kCache, KevoreeResolver, Notification) {
    $scope.devMode = KevoreeResolver.getDevMode();
    $scope.readingCache = true;
    $scope.clearDUCacheName = 'Reading';
    var registryUrl = new URL('http://'+kScript.options.registry.host+':'+kScript.options.registry.port);
    $scope.registryUrl = registryUrl;

    $scope.changeKevoreeRegistry = function() {
      if ($scope.registryUrl !== registryUrl) {
        try {
          var url = new URL($scope.registryUrl);
          kScript.setOptions({
              registry: {
                  host: url.hostname,
                  port: (url.port.length === 0) ? 80 : url.port
              }
          });
          Notification.success({
            title: 'Kevoree Registry',
            message: 'Changed to:\n<strong>' + $scope.registryUrl + '</strong>',
            delay: 3000
          });
        } catch (err) {
          Notification.error({
            title: 'Kevoree Registry',
            message: 'Invalid URL ' + $scope.registryUrl,
            delay: 3000
          });
        }
      }
    };

    $scope.canChangeKevoreeRegistry = function() {
      return $scope.registryUrl.length > 0 &&
        $scope.registryUrl !== registryUrl;
    };

    $scope.isKevSCacheEmpty = function() {
      return kScript.getCacheManager().getAll().length === 0;
    };

    $scope.isDUsCacheEmpty = true;
    kCache.getAll(function(err, entries) {
      $timeout(function() {
        if (err) {
          // TODO handle error
          console.warn(err);
        } else {
          $scope.isDUsCacheEmpty = (entries.length === 0);
        }
        $scope.readingCache = false;
        $scope.clearDUCacheName = 'Clear';
      });
    });

    $scope.clearKevSCache = function() {
      kScript.getCacheManager().clear();
    };

    $scope.clearDUsCache = function() {
      $scope.clearDUCacheName = 'Clearing';
      $scope.readingCache = true;
      kCache.clear(function(err) {
        $timeout(function() {
          if (err) {
            // TODO handle error
            console.warn(err);
          } else {
            $scope.isDUsCacheEmpty = true;
          }
          $scope.readingCache = false;
          $scope.clearDUCacheName = 'Clear';
        });
      });
    };

    $scope.enableDevMode = function() {
      $scope.devMode = true;
      KevoreeResolver.setDevMode(true);
    };

    $scope.disableDevMode = function() {
      $scope.devMode = false;
      KevoreeResolver.setDevMode(false);
    };
  });
