angular.module('browserApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('options', {
        parent: 'app',
        url: '/options',
        views: {
          'content@': {
            templateUrl: 'scripts/app/options/options.html',
            controller: 'OptionsCtrl'
          }
        }
      });
  });
