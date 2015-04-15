/**
 * @ngdoc function
 * @name browserApp.controller:RuntimeLogsCtrl
 * @description
 * # RuntimeLogsCtrl
 * Controller of the browserApp Runtime logs page
 */
angular.module('browserApp')
    .controller('RuntimeLogsCtrl', function ($scope, $state, kCore, kLogger, storage) {
        var LS_RUNTIME_LOGS_REVERSE = 'runtime_logs_reverse';

        if (kCore.isStarted() || !kCore.isDestroyed()) {
            $scope.reverse = storage.get(LS_RUNTIME_LOGS_REVERSE, false);
            console.log('Reverse logs:'+$scope.reverse);
            $scope.logs = kLogger.logs;

            $scope.cleanLogs = function () {
                kLogger.clean();
            };

            $scope.reverseLogs = function () {
                $scope.reverse = !$scope.reverse;
                storage.set(LS_RUNTIME_LOGS_REVERSE, $scope.reverse);
                console.log('Reverse logs:'+$scope.reverse);
            };
        } else {
            $state.go('main');
        }
    });
