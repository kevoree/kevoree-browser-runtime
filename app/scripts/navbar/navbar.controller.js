'use strict';

/**
 * @ngdoc function
 * @name browserApp.controller:NavBarCtrl
 * @description
 * # NavBarCtrl
 * Controller of the browserApp navigation bar
 */
angular.module('browserApp')
  .controller('NavBarCtrl', function ($scope, $state) {
    $scope.isCollapsed = true;
    $scope.$state = $state;
  });
