/**
 * @ngdoc function
 * @name browserApp.controller:OptionsCtrl
 * @description
 * # OptionsCtrl
 * Controller of the browserApp options page
 */
angular.module('browserApp')
  .controller('OptionsCtrl', function ($scope, kScript) {
    $scope.getKevSCacheLength = function () {
      return Object.keys(kScript.getCacheManager().cache).length;
    };

    $scope.clearKevSCache = function () {
      kScript.getCacheManager().clear();
    };
  });

