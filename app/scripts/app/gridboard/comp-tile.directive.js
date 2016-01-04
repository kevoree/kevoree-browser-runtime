angular.module('browserApp')
  .directive('compTile', function($q, kCore, KevoreeResolver) {
    return {
      restrict: 'A',
      require: '^gridsterItem',
      scope: {
        name: '=',
        path: '='
      },
      link: function(scope, elem, attrs, ctrl) {
        $q(function(resolve) {
          var comp = kCore.getCurrentModel().findByPath(scope.path);
          var depU = comp.typeDefinition
            .select('deployUnits[name=*]/filters[name=platform,value=javascript]')
            .get(0)
            .eContainer();
          resolve({
            depU: depU,
            comp: comp
          });
        }).then(function(obj) {
          var iframeContainer, iframe;

          KevoreeResolver
            .resolveUI(obj.depU)
            .then(function(ui) {
              if (ui.html && ui.styles && ui.scripts && ui.depModules) {
                ctrl.setSizeX(ui.layout.width);
                ctrl.setSizeY(ui.layout.height);

                window.comps = window.comps || {};
                window.comps[obj.comp.path()] = {
                  depModules: ui.depModules,
                  instanceFunc: function() {
                    return kCore.instances[obj.comp.path()];
                  },
                  ctrlFunc: kCore.instances[obj.comp.path()].uiController()
                };

                var styles = '';
                ui.styles.forEach(function(style) {
                  styles += style;
                });

                var scripts = '';
                ui.scripts.forEach(function(script) {
                  scripts += script;
                });

                iframeContainer = elem.get(0);
                iframe = document.createElement('iframe');
                iframe.setAttribute('sandbox', 'allow-forms allow-popups allow-scripts allow-same-origin');
                iframe.setAttribute('height', '100%');
                iframe.setAttribute('width', '100%');
                iframe.setAttribute('frameborder', '0');

                iframeContainer.appendChild(iframe);
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(
                  '<html>' +
                  '<head>' +
                  '<style type="text/css">body { margin: 0; }</style>' +
                  styles +
                  '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>' +
                  scripts +
                  '</head>' +
                  '<body data-ng-app="compApp" data-ng-controller="MainCtrl">' +
                  ui.html +
                  '<script>' +
                  'var comp = parent.comps[\'' + obj.comp.path() + '\'];' +
                  'var app = angular.module(\'compApp\', comp.depModules);' +
                  'app.factory(\'instance\', comp.instanceFunc);' +
                  'app.controller(\'MainCtrl\', comp.ctrlFunc);' +
                  'delete parent.comps[\'' + obj.comp.path() + '\'];' +
                  'delete comp;' +
                  '</script>' +
                  '</body>' +
                  '</html>'
                );
                iframe.contentWindow.document.close();

              } else {
                iframeContainer = elem.get(0);
                iframe = document.createElement('iframe');
                iframe.setAttribute('sandbox', 'allow-forms allow-popups allow-scripts allow-same-origin');
                iframe.setAttribute('height', '100%');
                iframe.setAttribute('width', '100%');
                iframe.setAttribute('frameborder', '0');

                iframeContainer.appendChild(iframe);
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(
                  '<html>' +
                  '<head>' +
                  '<style type="text/css">' +
                  'body {\n' +
                  'background-color: #f2dede;\n' +
                  'color: #a94442;\n' +
                  'font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n' +
                  'font-size: 14px;\n' +
                  'line-height: 1.42857143;\n' +
                  '}' +
                  '</style>' +
                  '</head>' +
                  '<body>' +
                  '<div class="alert alert-danger">' +
                  'Unable to load <strong>' + obj.comp.name + '</strong> view.' +
                  '<br/>' +
                  'It looks like <strong>' + obj.depU.name + '@' + obj.depU.version + '</strong> is outdated' +
                  '</div>' +
                  '</body>' +
                  '</html>'
                );
                iframe.contentWindow.document.close();
              }

            }, function(err) {
              iframeContainer = elem.get(0);
              iframe = document.createElement('iframe');
              iframe.setAttribute('sandbox', 'allow-forms allow-popups allow-scripts allow-same-origin');
              iframe.setAttribute('height', '100%');
              iframe.setAttribute('width', '100%');
              iframe.setAttribute('frameborder', '0');

              iframeContainer.appendChild(iframe);
              iframe.contentWindow.document.open();
              iframe.contentWindow.document.write(
                '<html>' +
                '<head>' +
                '<style type="text/css">' +
                'body {\n' +
                'background-color: #f2dede;\n' +
                'color: #a94442;\n' +
                'font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n' +
                'font-size: 14px;\n' +
                'line-height: 1.42857143;\n' +
                '}' +
                '</style>' +
                '</head>' +
                '<body>' +
                '<p>' + err.message + '</p>' +
                '</body>' +
                '</html>'
              );
              iframe.contentWindow.document.close();
            });
        });
      }
    };
  });
