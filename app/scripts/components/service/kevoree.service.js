'use strict';

angular.module('browserApp')
  .service('KevoreeResolver', function ($http, $q, kCache, NPM_REGISTRY_URL) {
    return {
      resolve: function (deployUnit) {
        var duFile = 'browser/'+deployUnit.name+'.min.js';

        return $q(function (resolve, reject, notify) {
          var cache = kCache.getJs(deployUnit);
          if (cache) {
            resolve(cache);
          } else {
            GZip.load(
              NPM_REGISTRY_URL.replace(/{name}/g, deployUnit.name).replace(/{version}/g, deployUnit.version),
              function (res) {
                var tar = new TarGZ();
                tar.parseTar(res.data.join(''));

                for (var i=0; i<tar.files.length; i++) {
                  if (tar.files[i].filename === 'package/'+duFile) {
                    kCache.addJs(deployUnit, tar.files[i].data);
                    resolve(tar.files[i].data);
                    return;
                  }
                }

                reject(new Error('Unable to find '+duFile+' for '+deployUnit.name+'@'+deployUnit.version));
              },
              notify,
              function (err) {
                console.error(err.stack);
                reject(new Error('Unable to find '+duFile+' for '+deployUnit.name+'@'+deployUnit.version));
              }
            );
          }
        });
      },
      resolveUI: function (deployUnit) {
        var duFile = 'browser/'+deployUnit.name+'.html';

        return $q(function (resolve, reject, notify) {
          var cache = kCache.getUI(deployUnit);
          if (cache) {
            resolve(cache);
          } else {
            GZip.load(
              NPM_REGISTRY_URL.replace(/{name}/g, deployUnit.name).replace(/{version}/g, deployUnit.version),
              function (res) {
                var tar = new TarGZ();
                tar.parseTar(res.data.join(''));

                for (var i=0; i<tar.files.length; i++) {
                  if (tar.files[i].filename === 'package/'+duFile) {
                    kCache.addUI(deployUnit, tar.files[i].data);
                    resolve(tar.files[i].data);
                    return;
                  }
                }

                reject(new Error('Unable to find '+duFile+' for '+deployUnit.name+'@'+deployUnit.version));
              },
              notify,
              function (err) {
                console.error(err.stack);
                reject(new Error('Unable to find '+duFile+' for '+deployUnit.name+'@'+deployUnit.version));
              }
            );
          }
        });
      }
    };
  });
