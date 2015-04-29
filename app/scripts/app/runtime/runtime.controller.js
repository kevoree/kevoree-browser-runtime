/**
 * @ngdoc function
 * @name browserApp.controller:KevScriptCtrl
 * @description
 * # RuntimeCtrl
 * Controller of the browserApp Runtime  page
 */
angular.module('browserApp')
    .controller('RuntimeCtrl', function ($scope, $state, $interval, kCore) {
      $scope.instances = {};
      $scope.hasInstances = function () {
        return Object.keys($scope.instances).length > 0;
      };

      function updateInstances() {
        $scope.instances = kCore.instances;

        Object.keys($scope.instances).forEach(function (path) {
          var instance = $scope.instances[path];
          if (instance) {
            var elem = kCore.getCurrentModel().findByPath(path);
            if (elem && elem.getRefInParent() !== 'components') {
              delete $scope.instances[path];
            }
          }
        });
      }

      if (!kCore.isDestroyed()) {
        $scope.nodeName = kCore.nodeName;
        updateInstances();

        var deployHandler = function () {
          updateInstances();
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        };

        kCore.on('deployed', deployHandler);
        $scope.$on('$destroy', function () {
          kCore.off('deployed', deployHandler);
        });

      } else {
        // redirect to main if runtime is not started
        $state.go('main');
      }
    });

