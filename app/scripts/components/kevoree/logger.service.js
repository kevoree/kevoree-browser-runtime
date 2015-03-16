'use strict';

angular.module('browserApp')
  .factory('kLogger', function (APP_NAME) {
    var BrowserLogger = KevoreeCommons.KevoreeLogger.extend({
      toString: 'BrowserLogger',

      construct: function () {
        this.logs = [];
      },

      info: function (tag, msg) {
        this.logs.push({
          level: 'default',
          tag: tag,
          msg: msg,
          time: new Date()
        });
        this._super(tag, msg);
      },

      warn: function (tag, msg) {
        this.logs.push({
          level: 'warning',
          tag: tag,
          msg: msg,
          time: new Date()
        });
        this._super(tag, msg);
      },

      debug: function (tag, msg) {
        this.logs.push({
          level: 'info',
          tag: tag,
          msg: msg,
          time: new Date()
        });
        this._super(tag, msg);
      },

      error: function (tag, msg) {
        this.logs.push({
          level: 'danger',
          tag: tag,
          msg: msg,
          time: new Date()
        });
        this._super(tag, msg);
      }
    });

    return new BrowserLogger(APP_NAME);
  });
