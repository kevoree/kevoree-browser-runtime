angular.module('browserApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('gridboard', {
                parent: 'app',
                url: '/gridboard',
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/gridboard/gridboard.html',
                        controller: 'GridboardCtrl'
                    }
                }
            });
    });
