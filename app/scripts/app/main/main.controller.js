/**
 * @ngdoc function
 * @name browserApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the browserApp main content div
 */
angular.module('browserApp')
  .controller('MainCtrl', function ($scope, $state, $timeout, kCore, kScript, GROUP_NAME, WS_HOST, WS_PORT) {
    if (kCore.isStarted()) {
      $state.go('dashboard');
      return;
    }

    $scope.processing = false;
    $scope.runtime = {
      groupName: GROUP_NAME,
      ws_host:   WS_HOST,
      ws_port:   WS_PORT,
      ws_path:   $scope.APP_ID
    };

    $scope.start = function () {
      if (!$scope.processing) {
        if ($scope.runtime.nodeName) {
          $scope.error = null;
          $scope.processing = true;
          kCore.start($scope.runtime.nodeName, function () {
            var kevs = kScript.defaultModel($scope.runtime);
            kScript.parse(kevs, function (err, model) {
              if (err) {
                $scope.error = err.message;
                $scope.processing = false;
                $scope.$apply();

              } else {
                kCore.deploy(model);
                $state.go('logs');
              }
            });

          });
        } else {
          $scope.error = 'You must give a node name';
        }
      }
    };

    $scope.closeError = function () {
      $scope.error = null;
    };
  });
