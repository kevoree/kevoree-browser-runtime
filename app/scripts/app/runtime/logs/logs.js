angular.module('browserApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('logs', {
        parent: 'runtime',
        url: '^/logs',
        templateUrl: 'scripts/app/runtime/logs/logs.html',
        controller: 'RuntimeLogsCtrl'
      });
  });
