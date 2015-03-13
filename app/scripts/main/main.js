'use strict';

angular.module('browserApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        parent: 'app',
        url: '/',
        views: {
          'content@': {
            templateUrl: 'scripts/main/main.html',
            controller: 'MainCtrl'
          }
        }
      });
  });
