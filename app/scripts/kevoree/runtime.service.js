'use strict';

angular.module('browserApp')
  .factory('runtime', function (KevScript) {

    function BrowserRuntime() {
      this.started = false;
      this.logger = new KevoreeCommons.KevoreeLogger('BrowserRuntime');
      this.core = new KevoreeCore('_fake_dir_', this.logger);

      this.core.on('stopped', function () {
        console.log('core stopped');
      }.bind(this));

      this.core.on('error', function (err) {
        if (this.deployCallback) {
          this.deployCallback(err);
        }
        console.err(err.stack);
      }.bind(this));

      this.core.on('adaptationError', function (err) {
        console.log('core adaptationError');
        console.err(err.stack);
      }.bind(this));

      this.core.on('rollbackError', function (err) {
        console.log('core rollbackError');
        console.err(err.stack);
      }.bind(this));

      this.core.on('deployed', function () {
        if (this.deployCallback) {
          this.deployCallback();
        }
      }.bind(this));

      this.core.on('started', function () {
        if (this.startCallback) {
          this.startCallback();
        }
      }.bind(this));
    }

    BrowserRuntime.prototype.start = function (nodeName, callback) {
      this.started = true;
      this.startCallback = callback;
      this.core.start(nodeName);
    };

    BrowserRuntime.prototype.stop = function () {
      this.core.stop();
    };

    BrowserRuntime.prototype.deploy = function (model, callback) {
      this.deployCallback = callback;
      this.core.deploy(model);
    };

    return new BrowserRuntime();
  });
