/**
 * @ngdoc overview
 * @name browserApp
 * @description
 * # browserApp
 *
 * Main module of the application.
 */
angular
    .module('browserApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap',
        'ui.router',
        'ui.codemirror',
        'ui.utils',
        'ui-notification',
        'gridster'
    ])
    .run(function ($rootScope, $window, kCore, randomId, WS_HOST, WS_PORT, VERSION) {
        $rootScope.VERSION = VERSION;
        $rootScope.APP_ID = randomId.gen();
        $rootScope.WS_HOST = WS_HOST;
        $rootScope.WS_PORT = WS_PORT;

        var bootstrapContainer = angular.element('#bootstrap-container');
        bootstrapContainer.fadeOut(function () {
            bootstrapContainer.remove();
        });

        $window.onbeforeunload = function (e) {
            if (kCore.isStarted()) {
                var message = "Kevoree is still running";
                e = e || window.event;

                // For IE and Firefox prior to version 4
                if (e) {
                    e.returnValue = message;
                }
                // For Safari
                return message;
            }
        };
    })
    .config(function ($stateProvider, $urlRouterProvider, NotificationProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('app', {
                abstract: true,
                views: {
                    'navbar@': {
                        templateUrl: 'scripts/app/navbar/navbar.html',
                        controller: 'NavBarCtrl'
                    }
                }
            });

        NotificationProvider.setOptions({ startTop: 60, replaceMessage: true });
    })
    .provider('runtimeStates', function ($stateProvider) {
        var states = {};
        this.$get = function () {
            return {
                state: function (name, state) {
                    states[name] = 'defined';
                    return $stateProvider.state(name, state);
                },

                has: function (name) {
                    return typeof states[name] !== 'undefined';
                }
            };
        };
    });
