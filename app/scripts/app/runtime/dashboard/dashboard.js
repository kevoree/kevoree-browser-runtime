angular.module('browserApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dashboard', {
        parent: 'runtime',
        url: '',
        templateUrl: 'scripts/app/runtime/dashboard/dashboard.html',
        controller: 'RuntimeDashboardCtrl'
      });
  });
