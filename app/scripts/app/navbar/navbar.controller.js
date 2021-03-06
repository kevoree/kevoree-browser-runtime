/**
 * @ngdoc function
 * @name browserApp.controller:NavBarCtrl
 * @description
 * # NavBarCtrl
 * Controller of the browserApp navigation bar
 */
angular.module('browserApp')
    .controller('NavBarCtrl', function ($scope, $state, $timeout, kCore, KevoreeResolver) {
        $scope.isCollapsed = true;
        $scope.$state = $state;
        $scope.kCore = kCore;

        $scope.isDevMode = function () {
            return KevoreeResolver.getDevMode();
        };
    });
