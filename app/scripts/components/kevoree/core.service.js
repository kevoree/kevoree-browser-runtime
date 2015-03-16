'use strict';

angular.module('browserApp')
  .factory('kCore', function (kLogger, kBootstrapper, MODULES_PATH) {

    function BrowserCore() {
      this.started = false;
      this.core = new KevoreeCore(MODULES_PATH, kLogger);
      this.core.setBootstrapper(kBootstrapper);

      this.core.on('stopped', function () {
        console.log('core stopped');
      }.bind(this));

      this.core.on('error', function (err) {
        if (this.deployCallback) {
          this.deployCallback(err);
          this.deployCallback = null;
        }

        if (this.startCallback) {
          this.startCallback();
          this.startCallback = null;
        }
      }.bind(this));

      this.core.on('adaptationError', function (err) {
        console.log('core adaptationError');
        console.err(err.stack);
      }.bind(this));

      this.core.on('rollbackError', function (err) {
        console.log('core rollbackError');
        console.err(err.stack);
      }.bind(this));

      this.core.on('deployError', function (err) {
        if (this.deployCallback) {
          this.deployCallback(err);
          this.deployCallback = null;
        }
      }.bind(this));

      this.core.on('deployed', function () {
        if (this.deployCallback) {
          this.deployCallback();
          this.deployCallback = null;
        }
      }.bind(this));

      this.core.on('started', function () {
        if (this.startCallback) {
          this.startCallback();
          this.startCallback = null;
        }
      }.bind(this));
    }

    BrowserCore.prototype.start = function (nodeName, callback) {
      this.started = true;
      this.startCallback = callback;
      this.core.start(nodeName);
    };

    BrowserCore.prototype.stop = function () {
      this.core.stop();
    };

    BrowserCore.prototype.deploy = function (model, callback) {

      this.deployCallback = callback;
      this.core.deploy(model);
    };

    BrowserCore.prototype.isStarted = function () {
      return this.started;
    };

    return new BrowserCore();
  });
