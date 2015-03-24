/**
 * @ngdoc function
 * @name browserApp.controller:KevScriptCtrl
 * @description
 * # HomeCtrl
 * Controller of the browserApp Runtime dashboard page
 */
angular.module('browserApp')
  .controller('RuntimeDashboardCtrl', function ($scope, $state, $interval, $modal, kCore) {
    $scope.isStarted = kCore.isStarted;
    $scope.startTime = kCore.startTime;

    function update() {
      $scope.runningTime = moment().from($scope.startTime, 'x');
    }

    update();
    var task = $interval(update, 10000);

    $scope.$on('$destroy', function () {
      $interval.cancel(task);
      task = undefined;
    });

    $scope.runningTimeFilter = function () {
      console.log(arguments);
    };

    $scope.stop = function () {
      $modal
        .open({
          templateUrl: 'scripts/app/runtime/dashboard/dashboard.stop-modal.html',
          size: 'sm'
        })
        .result
        .then(function () {
          // stop
          kCore.stop(function () {
            $state.go('main');
          });
        });
    };
  });

