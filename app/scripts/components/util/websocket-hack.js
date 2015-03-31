// this is an ugly hack to prevent browseryfied github.com/einaros/ws module to throw errors at runtime
// because the EventEmitter API used in Node.js is not available with the WebSocket browser API

WebSocket.prototype.on = function (event, callback) {
  this['on'+event] = callback;
};

WebSocket.prototype.once = function (event, callback) {
	var self = this;
  this['on'+event] = function () {
    callback.apply(callback, arguments);
    self['on'+event] = null;
  };
};


WebSocket.prototype.off = function (event, callback) {
  this['on'+event] = callback;
};
