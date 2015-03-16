'use strict';

angular.module('browserApp')
  .factory('kResolver', function (kLogger) {
    var BrowserResolver = KevoreeCommons.Resolver.extend({
      toString: 'BrowserResolver',

      resolve: function (deployUnit, force, callback) {
        kLogger.info(this.toString(), 'TODO resolve');
        callback(new Error('not implemented yet'));
      },

      uninstall: function (deployUnit, force, callback) {
        kLogger.info(this.toString(), 'TODO uninstall');
        callback(new Error('not implemented yet'));
      }
    });

    return new BrowserResolver();
  });
