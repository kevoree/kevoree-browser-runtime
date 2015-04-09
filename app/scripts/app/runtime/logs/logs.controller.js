/**
 * @ngdoc function
 * @name browserApp.controller:RuntimeLogsCtrl
 * @description
 * # RuntimeLogsCtrl
 * Controller of the browserApp Runtime logs page
 */
angular.module('browserApp')
    .controller('RuntimeLogsCtrl', function ($scope, $state, kCore, kLogger) {
      if (kCore.isStarted() || !kCore.isDestroyed()) {
        $scope.logs = kLogger.logs;
        $scope.cleanLogs = function () {
          kLogger.clean();
        };
      } else {
        $state.go('main');
      }
    });

