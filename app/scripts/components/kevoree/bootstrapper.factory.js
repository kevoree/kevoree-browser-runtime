'use strict';

angular.module('browserApp')
  .factory('kBootstrapper', function (kResolver, kLogger) {
    var BrowserBootstrapper = KevoreeCommons.Bootstrapper.extend({
      toString: 'BrowserBootstrapper',

      construct: function (logger, resolver) {
        this.log = logger;
        this.resolver = resolver;
      }
    });

    return new BrowserBootstrapper(kLogger, kResolver);
  });
