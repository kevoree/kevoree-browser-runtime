angular.module('browserApp')
  .factory('kLogger', function (APP_NAME) {
    var BrowserLogger = KevoreeCommons.KevoreeLogger.extend({
      toString: 'BrowserLogger',

      construct: function () {
        this.logs = [];
        this.emitter = new EventEmitter();
      },

      info: function (tag, msg) {
        if (typeof msg === 'undefined') {
          msg = tag;
          tag = this.tag;
        }
        var log = {
          level: 'default',
          tag: tag,
          msg: msg,
          time: new Date()
        };
        this.logs.push(log);
        this.emitter.emitEvent('log', [log]);
      },

      warn: function (tag, msg) {
        if (typeof msg === 'undefined') {
          msg = tag;
          tag = this.tag;
        }
        var log = {
          level: 'warning',
          tag: tag,
          msg: msg,
          time: new Date()
        };
        this.logs.push(log);
        this.emitter.emitEvent('log', [log]);
      },

      debug: function (tag, msg) {
        if (typeof msg === 'undefined') {
          msg = tag;
          tag = this.tag;
        }
        var log = {
          level: 'info',
          tag: tag,
          msg: msg,
          time: new Date()
        };
        this.logs.push(log);
        this.emitter.emitEvent('log', [log]);
      },

      error: function (tag, msg) {
        if (typeof msg === 'undefined') {
          msg = tag;
          tag = this.tag;
        }
        var log = {
          level: 'danger',
          tag: tag,
          msg: msg,
          time: new Date()
        };
        this.logs.push(log);
        this.emitter.emitEvent('log', [log]);
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
