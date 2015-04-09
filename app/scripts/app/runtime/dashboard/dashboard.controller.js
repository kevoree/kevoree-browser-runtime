/**
 * @ngdoc function
 * @name browserApp.controller:RuntimeDashboardCtrl
 * @description
 * # RuntimeDashboardCtrl
 * Controller of the browserApp Runtime dashboard page
 */
angular.module('browserApp')
  .controller('RuntimeDashboardCtrl', function ($scope, $state, $interval, $modal, $window, kCore) {
    $scope.isStarted = function () {
      return kCore.isStarted();
    };
    $scope.startTime = kCore.startTime;
    $scope.stopTime = kCore.stopTime;
    $scope.uptime = function () {
      if (kCore.isStarted()) {
        return new Date().getTime() - $scope.startTime;
      } else {
        $scope.stopTime = kCore.stopTime;
        return $scope.stopTime - $scope.startTime;
      }
    };

    var task = $interval($scope.uptime, 1000);

    $scope.$on('$destroy', function () {
      $interval.cancel(task);
      task = undefined;
    });

    $scope.stop = function () {
      $modal
        .open({
          templateUrl: 'scripts/app/runtime/dashboard/dashboard.stop-modal.html',
          size: 'sm'
        })
        .result
        .then(function () {
          kCore.stop();
        });
    };

    $scope.exit = function () {
      $window.location.reload();
    };
  });

