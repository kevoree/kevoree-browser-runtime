angular.module('browserApp')
    .config(function ($stateProvider) {
      $stateProvider
          .state('instance', {
            parent: 'runtime',
            url: '^/instance/{name}',
            templateUrl: 'scripts/app/runtime/instance/instance.html',
            controller: 'RuntimeInstanceCtrl'
          });
    });
