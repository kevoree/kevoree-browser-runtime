'use strict';

/**
 * @ngdoc overview
 * @name browserApp
 * @description
 * # browserApp
 *
 * Constants of the application.
 */
angular.module('browserApp')
  .constant('APP_NAME',          'BrowserRuntime')
  .constant('GROUP_NAME',        'sync')
  .constant('MASTER_NODE_NAME',  'master')
  .constant('MASTER_NODE_IP',    '127.0.0.1')
  .constant('MASTER_GROUP_PORT', '9000')
  .constant('MODULES_PATH',      '_fake_dir_');
