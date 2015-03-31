/**
 * @ngdoc function
 * @name browserApp.controller:KevScriptCtrl
 * @description
 * # HomeCtrl
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
  })
  .filter('uptime', function () {
    return function (uptime) {
      var d = moment.duration(uptime, 'milliseconds');
      uptime = '';
      if (d.days() === 1) {
        uptime = d.days()+' day ';
      } else if (d.days() > 1) {
        uptime = d.days()+' days ';
      }

      if (d.hours() > 9) {
        uptime += d.hours()+':';
      } else {
        uptime += '0' + d.hours()+':';
      }

      if (d.minutes() > 9) {
        uptime += d.minutes()+':';
      } else {
        uptime += '0' + d.minutes()+':';
      }

      if (d.seconds() > 9) {
        uptime += d.seconds();
      } else {
        uptime += '0' + d.seconds();
      }
      return uptime;
    };
  });

