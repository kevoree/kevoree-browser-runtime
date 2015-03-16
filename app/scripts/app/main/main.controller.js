'use strict';

/**
 * @ngdoc function
 * @name browserApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the browserApp main content div
 */
angular.module('browserApp')
  .controller('MainCtrl', function ($scope, $state, $timeout, kCore, kScript, GROUP_NAME, MASTER_GROUP_PORT, MASTER_NODE_NAME, MASTER_NODE_IP) {
    if (kCore.isStarted()) {
      $state.go('runtime');
      return;
    }

    $scope.runtime = {
      groupName:       GROUP_NAME,
      masterGroupPort: MASTER_GROUP_PORT,
      masterNodeName:  MASTER_NODE_NAME,
      masterNodeIP:    MASTER_NODE_IP
    };

    function runtimeError(msg) {
      kCore.stop();
      $scope.runtimeError = msg;
    }

    $scope.start = function () {
      if ($scope.runtime.nodeName) {
        $scope.runtimeError = null;
        kCore.start($scope.runtime.nodeName, function (err) {
          if (err) {
            runtimeError(err.message);

          } else {
            $state.go('dashboard');
            var kevs = kScript.defaultModel($scope.runtime);
            kScript.parse(kevs, function (err, model) {
              if (err) {
                runtimeError(err.message);

              } else {
                kCore.deploy(model, function (err) {
                  if (err) {
                    runtimeError(err.message);

                  } else {
                    console.log('CAFE!');
                  }
                });
              }
            });
          }
        });
      } else {
        runtimeError('You must give a node name');
      }
    };

    $scope.closeError = function () {
      $scope.runtimeError = null;
    };
  });
