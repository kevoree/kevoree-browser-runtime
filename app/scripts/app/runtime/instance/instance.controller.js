/**
 * @ngdoc function
 * @name browserApp.controller:RuntimeInstanceCtrl
 * @description
 * # RuntimeInstanceCtrl
 * Controller of the browserApp Runtime instance page
 */
angular.module('browserApp')
    .controller('RuntimeInstanceCtrl', function ($scope, $state, $stateParams, kCore, KevoreeResolver) {
        if (kCore.isStarted()) {
            var iframeElem = angular.element('iframe#component');
            var iframe = iframeElem.get(0).contentWindow;

            var node = kCore.getNode();
            var comp = node.findComponentsByID($stateParams.name);
            var meta = comp.typeDefinition.select('deployUnits[name=*]/filters[name=platform,value=javascript]');
            var depU = meta.get(0).eContainer();

            KevoreeResolver
                .resolveUI(depU)
                .then(function (ui) {
                    if (ui.html && ui.styles && ui.scripts && ui.depModules) {
                        iframeElem.parent().css('height', '100%');
                        window.compInstance = function () {
                            return kCore.instances[comp.path()];
                        };
                        window.depModules = ui.depModules;
                        window.mainCtrl = kCore.instances[comp.path()].uiController();

                        iframe.document.open();
                        iframe.document.write(
                            '<head>' +
                            '<style type="text/css">body { margin: 0; }</style>');
                        ui.styles.forEach(function (style) {
                            iframe.document.write('<style type="text/css">'+style+'</style>');
                        });
                        iframe.document.write(
                            '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>');
                        ui.scripts.forEach(function (script) {
                            iframe.document.write('<script type="application/javascript">'+script+'</script>');
                        });
                        iframe.document.write(
                            '<script type="application/javascript">\n' +
                            'angular.module(\'compApp\', parent.depModules);\n' +
                            'angular.module(\'compApp\').factory(\'instance\', parent.compInstance);\n' +
                            'angular.module(\'compApp\').controller(\'MainCtrl\', parent.mainCtrl);\n' +
                            'delete parent.compInstance;\n' +
                            'delete parent.depModules;\n' +
                            'delete parent.mainCtrl;\n' +
                            '</script>' +
                            '</head>' +
                            '<body data-ng-app="compApp" data-ng-controller="MainCtrl">');
                        iframe.document.write(ui.html);
                        iframe.document.write('</body>');
                        iframe.document.close();
                    } else {
                        iframe.document.open();
                        iframe.document.write(
                            '<head>' +
                            '<style type="text/css">' +
                            'body {' +
                            'background-color: #f2dede;\n' +
                            'color: #a94442;\n' +
                            'font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n' +
                            'font-size: 14px;\n' +
                            'line-height: 1.42857143;\n'+
                            '}' +
                            '</style>' +
                            '</head>' +
                            '<body>' +
                            '<div class="alert alert-danger">' +
                            'Unable to load <strong>'+comp.name+'</strong> view.' +
                            '<br/>' +
                            'It looks like <strong>'+depU.name+'@'+depU.version+'</strong> is outdated' +
                            '</div>' +
                            '</body>');
                        iframe.document.close();
                    }

                }, function (err) {
                    console.log('instance.controller.js error', err);
                    iframe.document.open();
                    iframe.document.write(
                        '<head>' +
                        '<style type="text/css">' +
                            'body {' +
                                'background-color: #f2dede;\n' +
                                'color: #a94442;\n' +
                                'font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n' +
                                'font-size: 14px;\n' +
                                'line-height: 1.42857143;\n'+
                            '}' +
                        '</style>' +
                        '</head>' +
                        '<body>' +
                        '<p>'+err.message+'</p>' +
                        '</body>');
                    iframe.document.close();
                });
        } else {
            $state.go('main');
        }
    });