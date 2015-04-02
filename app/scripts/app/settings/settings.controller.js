/**
 * @ngdoc function
 * @name browserApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the browserApp options page
 */
angular.module('browserApp')
  .controller('SettingsCtrl', function ($scope, kScript) {
    $scope.getKevSCacheLength = function () {
      return Object.keys(kScript.getCacheManager().cache).length;
    };

    $scope.clearKevSCache = function () {
      kScript.getCacheManager().clear();
    };
  });

