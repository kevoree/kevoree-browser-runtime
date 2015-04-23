angular.module('browserApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dashboard', {
        parent: 'runtime',
        url: '^/dashboard',
        templateUrl: 'scripts/app/runtime/dashboard/dashboard.html',
        controller: 'RuntimeDashboardCtrl'
      });
  });
