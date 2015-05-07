/**
 * @ngdoc function
 * @name browserApp.controller:RuntimeLogsCtrl
 * @description
 * # RuntimeLogsCtrl
 * Controller of the browserApp Runtime logs page
 */
angular.module('browserApp')
    .controller('RuntimeLogsCtrl', function ($scope, $state, $timeout, kCore, kLogger, storage) {
        var LS_RUNTIME_LOGS_REVERSE = 'runtime_logs_reverse';

        if (kCore.isStarted() || !kCore.isDestroyed()) {
            $scope.reverse = storage.get(LS_RUNTIME_LOGS_REVERSE, false);
            $scope.logs = kLogger.logs.slice(0); // clone array

            function logHandler(log) {
                $timeout(function () {
                    $scope.logs.push(log);
                });
            }

            kLogger.on('log', logHandler);
            $scope.$on('$destroy', function () {
                kLogger.off('log', logHandler);
            });

            $scope.cleanLogs = function () {
                kLogger.clean();
                $scope.logs = [];
            };

            $scope.reverseLogs = function () {
                $scope.reverse = !$scope.reverse;
                storage.set(LS_RUNTIME_LOGS_REVERSE, $scope.reverse);
            };
        } else {
            $state.go('main');
        }
    });
