angular.module('browserApp')
  .controller('GridboardCtrl', function($scope, $timeout, $state, kCore) {
    function startDragOrResize(evt, elem) {
      angular.element('.comp-tile-overlay').removeClass('comp-tile-overlay-hidden');
    }

    function stopDragOrResize(evt, elem) {
      angular.element('.comp-tile-overlay').addClass('comp-tile-overlay-hidden');
    }

    $scope.gridsterOpts = {
      columns: 6,
      swapping: true,
      resizable: {
        handles: ['se'],
        start: function (evt, elem) {
            startDragOrResize(evt, elem);
            elem.find('.comp-tile-overlay').css('cursor', 'se-resize');
        },
        stop: function (evt, elem) {
            stopDragOrResize(evt, elem);
            elem.find('.comp-tile-overlay').css('cursor', 'auto');
        },
      },
      draggable: {
          start: function (evt, elem) {
              startDragOrResize(evt, elem);
              elem.find('.comp-tile-overlay').css('cursor', 'move');
          },
          stop: function (evt, elem) {
              stopDragOrResize(evt, elem);
              elem.find('.comp-tile-overlay').css('cursor', 'auto');
          },
      }
    };
    $scope.widgets = [];

    function updateInstances() {
      $scope.widgets.length = 0;
      $timeout(function () {
          Object.keys(kCore.instances).forEach(function(path) {
            var elem = kCore.getCurrentModel().findByPath(path);
            if (elem && elem.getRefInParent() === 'components') {
              $scope.widgets.push({
                path: path,
                name: elem.name,
                sizeX: 1,
                sizeY: 1
              });
            }
          });
      });
    }

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
