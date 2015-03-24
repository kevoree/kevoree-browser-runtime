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

      window.$state = $state;
      window.runtimeStates = runtimeStates;

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
                      return KevoreeResolver.resolveUI(meta.get(0).eContainer());
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

        //var node = kCore.getNode();
        //if (node) {
        //  var instances = kCore.getInstances();
        //  node.components.array.forEach(function (comp) {
        //    if (!runtimeStates.has(comp.name)) {
        //      var meta = comp.typeDefinition.select('deployUnits[name=*]/filters[name=platform,value=javascript]');
        //      runtimeStates
        //        .state(comp.name, {
        //          parent: 'runtime',
        //          url: '/'+comp.name,
        //          templateUrl: KevoreeResolver.getUIUrl(meta.get(0).eContainer()),
        //          controller: instances[comp.path()].uiController()
        //        });
        //    }
        //    $scope.instances[comp.name] = comp;
        //  });
        //}
      }

      if (kCore.isStarted()) {
        $scope.nodeName = kCore.core.nodeName;
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

