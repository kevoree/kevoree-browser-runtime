'use strict';

/**
 * @ngdoc function
 * @name browserApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the browserApp main content div
 */
angular.module('browserApp')
  .controller('MainCtrl', function ($scope, $timeout, runtime, KevScript, GROUP_NAME, MASTER_GROUP_PORT, MASTER_NODE_NAME, MASTER_NODE_IP) {
    $scope.runtime = {
      groupName:       GROUP_NAME,
      masterGroupPort: MASTER_GROUP_PORT,
      masterNodeName:  MASTER_NODE_NAME,
      masterNodeIP:    MASTER_NODE_IP
    };

    function runtimeError(msg) {
      runtime.stop();
      $scope.runtimeError = msg;
    }

    $scope.start = function () {
      if ($scope.runtime.nodeName) {
        $scope.runtimeError = null;
        runtime.start($scope.runtime.nodeName, function (err) {
          console.log('started');
          if (err) {
            runtimeError(err.message);

          } else {
            var kevs = KevScript.defaultModel($scope.runtime);
            console.log('==== Bootstrap model ====');
            console.log(kevs);
            console.log('=========================');
            KevScript.parse(kevs, function (err, model) {
              if (err) {
                runtimeError(err.message);

              } else {
                runtime.deploy(model, function (err) {
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
