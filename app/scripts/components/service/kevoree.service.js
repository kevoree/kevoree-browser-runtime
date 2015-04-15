angular.module('browserApp')
    .service('KevoreeResolver', function ($http, $q, kCache, kLogger, storage, NPM_REGISTRY_URL) {
      var LS_DEV_MODE = 'dev_mode';

      return {
        devMode: storage.get(LS_DEV_MODE, false),
        resolve: function (deployUnit) {
          var devMode = this.devMode;
          var duFile = 'browser/'+deployUnit.name+'.min.js';

          function resolveProcess(resolve, reject) {
            kCache.getJs(deployUnit, function (err, data) {
              if (err) {
                TarGZ.load(
                    NPM_REGISTRY_URL.replace(/{name}/g, deployUnit.name).replace(/{version}/g, deployUnit.version),
                    function (files) {
                      for (var i=0; i < files.length; i++) {
                        if (files[i].filename === 'package/'+duFile) {
                          kCache.addJs(deployUnit, files[i].data);
                          resolve(files[i].data);
                          return;
                        }
                      }
                      // unable to find the duFile
                      reject(new Error('Unable to find '+duFile+' for '+deployUnit.name+'@'+deployUnit.version));
                    },
                    null,
                    function (err) {
                      reject(err);
                    });
              } else {
                resolve(data);
              }
            });
          }

          return $q(function (resolve, reject) {
            if (devMode) {
              kLogger.debug('KevoreeResolver', 'DevMode enabled: checking localhost:59000 before registry.npmjs.org');
              $http
                  .get('http://localhost:59000/'+deployUnit.name+'.js')
                  .then(
                  function (res) {
                    resolve(res.data);
                  },
                  function () {
                    resolveProcess(resolve, reject);
                  });
            } else {
              resolveProcess(resolve, reject);
            }
          });
        },
        resolveUI: function (deployUnit) {
          var devMode = this.devMode;
          var duFile = 'browser/'+deployUnit.name+'.html';

          function resolveProcess(resolve, reject) {
            kCache.getUI(deployUnit, function (err, data) {
              if (err) {
                TarGZ.load(
                    NPM_REGISTRY_URL.replace(/{name}/g, deployUnit.name).replace(/{version}/g, deployUnit.version),
                    function (files) {
                      for (var i=0; i < files.length; i++) {
                        if (files[i].filename === 'package/'+duFile) {
                          kCache.addUI(deployUnit, files[i].data);
                          resolve(files[i].data);
                          return;
                        }
                      }
                      // unable to find the duFile
                      reject(new Error('Unable to find '+duFile+' for '+deployUnit.name+'@'+deployUnit.version));
                    },
                    null,
                    function (err) {
                      reject(err);
                    });
              } else {
                resolve(data);
              }
            });
          }

          return $q(function (resolve, reject) {
            if (devMode) {
              kLogger.debug('KevoreeResolver', 'DevMode enabled: checking localhost:59000 before registry.npmjs.org');
              $http
                  .get('http://localhost:59000/'+deployUnit.name+'.html')
                  .then(
                  function (res) {
                    resolve(res.data);
                  },
                  function () {
                    resolveProcess(resolve, reject);
                  });
            } else {
              resolveProcess(resolve, reject);
            }
          });
        },

        setDevMode: function (status) {
          this.devMode = status;
            storage.set(LS_DEV_MODE, this.devMode);
        },

        getDevMode: function () {
          return this.devMode;
        }
      };
    });
