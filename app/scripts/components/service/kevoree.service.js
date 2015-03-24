angular.module('browserApp')
  .service('KevoreeResolver', function ($http, $q, kCache, NPM_REGISTRY_URL) {
    return {
      resolve: function (deployUnit) {
        var duFile = 'browser/'+deployUnit.name+'.min.js';

        return $q(function (resolve, reject) {
          var cache = kCache.getJs(deployUnit);
          if (cache) {
            resolve(cache);
          } else {
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
          }
        });
      },
      resolveUI: function (deployUnit) {
        var duFile = 'browser/'+deployUnit.name+'.html';

        return $q(function (resolve, reject) {
          var cache = kCache.getUI(deployUnit);
          if (cache) {
            resolve(cache);
          } else {
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
          }
        });
      }
    };
  });
