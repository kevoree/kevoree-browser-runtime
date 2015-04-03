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
    'ui-notification'
  ])
  .run(function ($rootScope, Notification, WS_HOST, WS_PORT, VERSION) {
    $rootScope.VERSION = VERSION;
    $rootScope.APP_ID = uuid.v4();
    $rootScope.WS_HOST = WS_HOST;
    $rootScope.WS_PORT = WS_PORT;

    Notification.config({top: 60});
  })
  .config(function ($stateProvider, $urlRouterProvider) {
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
