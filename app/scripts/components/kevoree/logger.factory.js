'use strict';

angular.module('browserApp')
  .factory('kLogger', function (APP_NAME) {
    var BrowserLogger = KevoreeCommons.KevoreeLogger.extend({
      toString: 'BrowserLogger',

      construct: function () {
        this.logs = [];
        this.emitter = new EventEmitter();
      },

      info: function (tag, msg) {
        this.logs.push({
          level: 'default',
          tag: tag,
          msg: msg,
          time: new Date()
        });
        this.emitter.emitEvent('info', [tag, msg]);
      },

      warn: function (tag, msg) {
        this.logs.push({
          level: 'warning',
          tag: tag,
          msg: msg,
          time: new Date()
        });
        this.emitter.emitEvent('warn', [tag, msg]);
      },

      debug: function (tag, msg) {
        this.logs.push({
          level: 'info',
          tag: tag,
          msg: msg,
          time: new Date()
        });
        this.emitter.emitEvent('debug', [tag, msg]);
      },

      error: function (tag, msg) {
        this.logs.push({
          level: 'danger',
          tag: tag,
          msg: msg,
          time: new Date()
        });
        this.emitter.emitEvent('error', [tag, msg]);
      },

      on: function (event, callback) {
        this.emitter.on(event, callback);
      },

      once: function (event, callback) {
        this.emitter.once(event, callback);
      },

      off: function (event, callback) {
        this.emitter.off(event, callback);
      },

      clean: function () {
        this.logs.length = 0;
      }
    });

    return new BrowserLogger(APP_NAME);
  });
