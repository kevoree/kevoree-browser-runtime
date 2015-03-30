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
  .constant('APP_ID',             uuid.v4())
  .constant('GROUP_NAME',        'sync')
  .constant('WS_HOST',           'ws.kevoree.org')
  .constant('WS_PORT',           '80')
  .constant('MODULES_PATH',      '_fake_dir_')
  .constant('NPM_REGISTRY_URL',  'http://registry.npmjs.org/{name}/-/{name}-{version}.tgz');
