'use strict';

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
    'ui.utils'
  ])
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
  });
