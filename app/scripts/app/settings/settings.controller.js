/**
 * @ngdoc function
 * @name browserApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the browserApp options page
 */
angular.module('browserApp')
  .controller('SettingsCtrl', function ($scope, kScript, KevoreeResolver) {
    $scope.devMode = KevoreeResolver.getDevMode();

    $scope.getKevSCacheLength = function () {
      return Object.keys(kScript.getCacheManager().cache).length;
    };

    $scope.clearKevSCache = function () {
      kScript.getCacheManager().clear();
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

