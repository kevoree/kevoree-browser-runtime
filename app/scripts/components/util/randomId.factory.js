angular.module('browserApp')
    .factory('randomId', function () {
      var CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      return {
        gen: function () {
          var id = '';
          for (var i=0; i < 7; i++) {
            id += CHARS.charAt(parseInt(Math.random()*CHARS.length));
          }
          return id;
        }
      };
    });
