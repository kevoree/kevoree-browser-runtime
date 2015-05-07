/**
 * @ngdoc function
 * @name browserApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the browserApp options page
 */
angular.module('browserApp')
    .controller('SettingsCtrl', function ($scope, $timeout, kScript, kCache, KevoreeResolver) {
      $scope.devMode = KevoreeResolver.getDevMode();
      $scope.readingCache = true;
      $scope.clearDUCacheName = 'Reading';

      $scope.isKevSCacheEmpty = function () {
        return kScript.getCacheManager().getAll().length === 0;
      };

      $scope.isDUsCacheEmpty = true;
      kCache.getAll(function (err, entries) {
        $timeout(function () {
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

      $scope.clearKevSCache = function () {
        kScript.getCacheManager().clear();
      };

      $scope.clearDUsCache = function () {
        $scope.clearDUCacheName = 'Clearing';
        $scope.readingCache = true;
        kCache.clear(function (err) {
          $timeout(function () {
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

      $scope.enableDevMode = function () {
        $scope.devMode = true;
        KevoreeResolver.setDevMode(true);
      };

      $scope.disableDevMode = function () {
        $scope.devMode = false;
        KevoreeResolver.setDevMode(false);
      };
    });
