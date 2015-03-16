'use strict';

/**
 * @ngdoc function
 * @name browserApp.controller:KevScriptCtrl
 * @description
 * # RuntimeCtrl
 * Controller of the browserApp Runtime  page
 */
angular.module('browserApp')
  .controller('RuntimeCtrl', function ($scope, $state, $interval, kCore) {
    $scope.$state = $state;
    if (kCore.isStarted()) {
      $scope.nodeName = kCore.core.nodeName;

    } else {
      // redirect to main if runtime is not started
      $state.go('main');
    }
  });

