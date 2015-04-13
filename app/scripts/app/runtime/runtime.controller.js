/**
 * @ngdoc function
 * @name browserApp.controller:KevScriptCtrl
 * @description
 * # RuntimeCtrl
 * Controller of the browserApp Runtime  page
 */
angular.module('browserApp')
  .controller('RuntimeCtrl', ['$scope' , '$state', '$interval', 'runtimeStates', 'kCore', 'KevoreeResolver',
    function ($scope, $state, $interval, runtimeStates, kCore, KevoreeResolver) {
      $scope.$state = $state;
      $scope.instances = {};
      $scope.hasInstances = function () {
        return Object.keys($scope.instances).length > 0;
      };

      function updateInstances() {
        $scope.instances = kCore.instances;

        Object.keys($scope.instances).forEach(function (path) {
          var instance = $scope.instances[path];
            if (typeof instance.uiController === 'function') {
              if (!runtimeStates.has(instance.getName())) {
                var meta = instance.getModelEntity().typeDefinition.select('deployUnits[name=*]/filters[name=platform,value=javascript]');
                runtimeStates
                  .state(instance.getName(), {
                    parent: 'runtime',
                    url: '/'+instance.getName(),
                    templateProvider: function () {
                      return KevoreeResolver
                        .resolveUI(meta.get(0).eContainer())
                        .then(function (html) {
                          return html;
                        }, function () {
                          return '<div class="alert alert-danger">Unable to load '+instance.getName()+' view</div>';
                        })
                    },
                    controllerProvider: function () {
                      return $scope.instances[path].uiController();
                    }
                  });
              }
            } else {
              delete $scope.instances[path];
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
    }]);
