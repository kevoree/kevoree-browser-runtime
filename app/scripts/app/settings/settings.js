angular.module('browserApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('settings', {
        parent: 'app',
        url: '/settings',
        views: {
          'content@': {
            templateUrl: 'scripts/app/settings/settings.html',
            controller: 'SettingsCtrl'
          }
        }
      });
  });
