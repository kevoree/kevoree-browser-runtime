'use strict';

angular.module('browserApp')
  .factory('kCore', function ($interval, kLogger, kBootstrapper, MODULES_PATH) {

    function BrowserCore() {
      this.instances = {};
      this.started = false;
      this.emitter = new EventEmitter();
      this.core = new KevoreeCore(MODULES_PATH, kLogger);
      this.core.setBootstrapper(kBootstrapper);

      this.core.on('instanceStarted', function (instance) {
        this.instances[instance.getPath()] = instance;
      }.bind(this));

      this.core.on('instanceRemoved', function (instance) {
        delete this.instances[instance.getPath()];
      }.bind(this));

      this.core.on('stopped', function () {
        // clean logs
        kLogger.clean();
        this.started = false;
        this.startTime = null;
        if (this.stopCallback) {
          this.stopCallback();
          this.stopCallback = null;
        }
        this.emitter.emitEvent('stopped');
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
        this.emitter.emitEvent('error');
      }.bind(this));

      this.core.on('adaptationError', function (err) {
        if (this.deployCallback) {
          this.deployCallback(err);
          this.deployCallback = null;
        }
        this.emitter.emitEvent('adaptationError');
      }.bind(this));

      this.core.on('rollbackError', function (err) {
        console.error(err.stack);
        this.emitter.emitEvent('rollbackError');
        this.core.stop();
      }.bind(this));

      this.core.on('deployError', function (err) {
        if (this.deployCallback) {
          this.deployCallback(err);
          this.deployCallback = null;
        }
        this.emitter.emitEvent('deployError');
      }.bind(this));

      this.core.on('deployed', function (model) {
        this.model = model;
        if (this.deployCallback) {
          this.deployCallback();
          this.deployCallback = null;
        }
        this.emitter.emitEvent('deployed');
      }.bind(this));

      this.core.on('started', function () {
        this.startTime = new Date().getTime();
        if (this.startCallback) {
          this.startCallback();
          this.startCallback = null;
        }
        this.emitter.emitEvent('started');
      }.bind(this));
    }

    BrowserCore.prototype.start = function (nodeName, callback) {
      this.started = true;
      this.startCallback = callback;
      this.core.start(nodeName);
    };

    BrowserCore.prototype.stop = function (callback) {
      this.stopCallback = callback;
      this.core.stop();
    };

    BrowserCore.prototype.deploy = function (model, callback) {
      this.deployCallback = callback;
      this.core.deploy(model);
    };

    BrowserCore.prototype.getNode = function () {
      if (this.model && this.core.getNodeName()) {
        return this.model.findNodesByID(this.core.getNodeName());
      } else {
        return null;
      }
    };

    BrowserCore.prototype.getInstances = function () {
      if (this.core.nodeInstance) {
        if (this.core.nodeInstance.adaptationEngine) {
          if (this.core.nodeInstance.adaptationEngine.modelObjMapper) {
            return this.core.nodeInstance.adaptationEngine.modelObjMapper.map;
          }
        }
      }
      return null;
    };

    BrowserCore.prototype.getCurrentModel = function () {
      return this.core.getCurrentModel();
    };

    BrowserCore.prototype.isStarted = function () {
      return this.started;
    };

    BrowserCore.prototype.on = function (event, callback) {
      this.emitter.on(event, callback);
    };

    BrowserCore.prototype.once = function (event, callback) {
      this.emitter.once(event, callback);
    };

    BrowserCore.prototype.off = function (event, callback) {
      this.emitter.off(event, callback);
    };

    return new BrowserCore();
  });
