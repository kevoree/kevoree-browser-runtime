angular.module('browserApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('kevscript', {
        parent: 'app',
        url: '/kevscript',
        views: {
          'content@': {
            templateUrl: 'scripts/app/kevscript/kevscript.html',
            controller: 'KevScriptCtrl'
          }
        }
      });
  });
