angular.module('browserApp')
    .config(function ($stateProvider) {
      $stateProvider
          .state('runtime', {
            abstract: true,
            parent: 'app',
            url: '/runtime',
            views: {
              'content@': {
                templateUrl: 'scripts/app/runtime/runtime.html',
                controller: 'RuntimeCtrl'
              }
            }
          });
    });
