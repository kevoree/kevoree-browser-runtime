angular.module('browserApp')
  .factory('gridItems', function() {
    return {};
  })
  .controller('GridboardCtrl', function($scope, $timeout, $state, kCore, gridItems) {
    function startDragOrResize(evt, elem) {
      angular.element('.comp-tile-overlay').removeClass('comp-tile-overlay-hidden');
    }

    function stopDragOrResize(evt, elem) {
      angular.element('.comp-tile-overlay').addClass('comp-tile-overlay-hidden');
    }

    function updateInstances() {
      $timeout(function() {
        var instances = Object.keys(kCore.instances);

        instances.forEach(function (path) {
            if (!$scope.gridItems[path]) {
                var elem = kCore.getCurrentModel().findByPath(path);
                if (elem && elem.getRefInParent() === 'components') {
                    $scope.gridItems[path] = {
                      path: path,
                      name: elem.name,
                      type: elem.typeDefinition.name,
                      sizeX: 1,
                      sizeY: 1
                    };
                }
            }
        });

        for (var path in $scope.gridItems) {
            if (instances.indexOf(path) === -1) {
                delete $scope.gridItems[path];
            }
        }
      });
    }

    $scope.hasGridItems = function () {
        return Object.keys(gridItems).length > 0;
    };

    $scope.removeTile = function (item) {
        delete $scope.gridItems[item.path];
    };

    $scope.gridsterOpts = {
      columns: 6,
      swapping: true,
      mobileBreakPoint: 1000,
      resizable: {
        handles: ['se'],
        start: function(evt, elem) {
          startDragOrResize(evt, elem);
          elem.find('.comp-tile-overlay').css('cursor', 'se-resize');
        },
        stop: function(evt, elem, item) {
          stopDragOrResize(evt, elem);
          elem.find('.comp-tile-overlay').css('cursor', 'auto');
          item.resized = true;
        },
      },
      draggable: {
        start: function(evt, elem) {
          startDragOrResize(evt, elem);
          elem.find('.comp-tile-overlay').css('cursor', 'move');
        },
        stop: function(evt, elem) {
          stopDragOrResize(evt, elem);
          elem.find('.comp-tile-overlay').css('cursor', 'auto');
        },
      }
    };
    $scope.gridItems = gridItems;

    if (!kCore.isDestroyed()) {
      $scope.nodeName = kCore.nodeName;
      updateInstances();

      kCore.on('deployed', updateInstances);
      $scope.$on('$destroy', function() {
        kCore.off('deployed', updateInstances);
      });

    } else {
      // redirect to main if runtime is not started
      $state.go('main');
    }
  });
