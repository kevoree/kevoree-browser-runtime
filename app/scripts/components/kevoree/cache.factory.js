'use strict';

angular.module('browserApp')
  .factory('kCache', function () {

    function KevoreeCache() {
      this.cache = {};
    }

    KevoreeCache.prototype.addJs = function (du, js) {
      var cached = this.cache[du.name+'_'+du.version];
      if (cached) {
        cached.js = js;
      } else {
        this.cache[du.name+'_'+du.version] = {
          js: js
        };
      }
    };

    KevoreeCache.prototype.addUI = function (du, html) {
      var cached = this.cache[du.name+'_'+du.version];
      if (cached) {
        cached.ui = html;
      } else {
        this.cache[du.name+'_'+du.version] = {
          ui: html
        };
      }
    };

    KevoreeCache.prototype.getJs = function (du) {
      if (this.cache[du.name+'_'+du.version]) {
        return this.cache[du.name+'_'+du.version].js;
      }
      return null;
    };

    KevoreeCache.prototype.getUI = function (du) {
      if (this.cache[du.name+'_'+du.version]) {
        return this.cache[du.name+'_'+du.version].ui;
      }
      return null;
    };

    return new KevoreeCache();
  });
