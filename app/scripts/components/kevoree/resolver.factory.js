angular.module('browserApp')
  .factory('kResolver', function (KevoreeResolver) {
    var BrowserResolver = KevoreeCommons.Resolver.extend({
      toString: 'BrowserResolver',

      resolve: function (deployUnit, force, callback) {
        KevoreeResolver.resolve(deployUnit)
          .then(function (data) {
            // TODO change that so that it protects globals
            eval(data); /* jshint ignore:line */
            console.log(deployUnit.name+'@'+deployUnit.version+' loaded');
            var Class = require(deployUnit.name);
            callback(null, Class);
          }, function (err) {
            callback(err);
          });
      },

      uninstall: function (deployUnit, callback) {
        callback();
      }
    });

    return new BrowserResolver();
  });
