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

    $scope.isKevSCacheEmpty = function () {
      return kScript.getCacheManager().getAll().length === 0;
    };

    $scope.isDUsCacheEmpty = true;
    kCache.getAll(function (entries) {
      $timeout(function () {
        $scope.isDUsCacheEmpty = (entries.length === 0);
      });
    });

    $scope.clearKevSCache = function () {
      kScript.getCacheManager().clear();
    };

    $scope.clearDUsCache = function () {
      kCache.clear(function () {
        $timeout(function () {
          $scope.isDUsCacheEmpty = true;
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

