angular.module('browserApp')
    .service('KevoreeResolver', function ($http, $q, kCache, kLogger, storage, NPM_REGISTRY_URL) {
        var LS_DEV_MODE = 'dev_mode';

        function httpGet(url, cb) {
            $http.get(url)
                .then(function (res) {
                    cb(null, res.data);
                }, function (err) {
                    cb(err);
                });
        }

        return {
            /**
             * boolean devMode property
             */
            devMode: storage.get(LS_DEV_MODE, false),

            /**
             *
             * @param deployUnit
             * @returns {*}
             */
            resolve: function (deployUnit) {
                var devMode = this.devMode;
                var duFile = 'browser/'+deployUnit.name+'.min.js';

                function resolveProcess(resolve, reject) {
                    kCache.get(deployUnit, function (err, files) {
                        if (err) {
                            console.warn('DeployUnits Cache Error: '+err.message);
                            TarGZ.load(
                                NPM_REGISTRY_URL.replace(/{name}/g, deployUnit.name).replace(/{version}/g, deployUnit.version),
                                function (files) {
                                    var js = null;
                                    var rawConf = null;
                                    var html = false;
                                    for (var i=0; i < files.length; i++) {
                                        var filename = files[i].filename.substr('package/browser/'.length, files[i].filename.length);
                                        if (rawConf && js && html) {
                                            break;
                                        } else if (files[i].filename === 'package/browser/ui-config.json') {
                                            rawConf = JSON.parse(files[i].data);
                                            kCache.add(deployUnit, filename, files[i].data);
                                            continue;
                                        }
                                        if (files[i].filename === 'package/browser/'+deployUnit.name+'.html') {
                                            html = true;
                                            kCache.add(deployUnit, filename, files[i].data);
                                        }
                                        if (files[i].filename === 'package/browser/'+deployUnit.name+'.min.js') {
                                            js = files[i].data;
                                            kCache.add(deployUnit, filename, files[i].data);
                                        }
                                    }

                                    if (rawConf) {
                                        files.forEach(function (file) {
                                            var filename = file.filename.substr('package/browser/'.length, file.filename.length);
                                            if (rawConf.scripts.indexOf(file.filename.substr(0, 'package/browser/'.length))) {
                                                kCache.add(deployUnit, filename, file.data);
                                            } else if (rawConf.styles.indexOf(file.filename.substr(0, 'package/browser/'.length))) {
                                                kCache.add(deployUnit, filename, file.data);
                                            }
                                        });
                                    }

                                    if (!js) {
                                        reject(new Error('Unable to find '+duFile+' for '+deployUnit.name+'@'+deployUnit.version));
                                    } else {
                                        resolve(js);
                                    }
                                },
                                null,
                                function (err) {
                                    reject(err);
                                });
                        } else {
                            for (var i=0; i < files.length; i++) {
                                if (files[i].name === deployUnit.name+'.min.js') {
                                    resolve(files[i].data);
                                    return;
                                }
                            }
                            reject(new Error('Unable to find cached '+duFile+' for '+deployUnit.name+'@'+deployUnit.version));
                        }
                    });
                }

                return $q(function (resolve, reject) {
                    if (devMode) {
                        kLogger.debug('KevoreeResolver', 'DevMode enabled: checking localhost:59000 before registry.npmjs.org');
                        $http
                            .get('http://localhost:59000/'+deployUnit.name+'/'+deployUnit.version+'/'+deployUnit.name+'.js')
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

            /**
             *
             * @param deployUnit
             * @returns {*}
             */
            resolveUI: function (deployUnit) {
                var devMode = this.devMode;

                function resolveProcess(resolve, reject) {
                    kCache.get(deployUnit, function (err, files) {
                        if (err) {
                            reject(err);
                        } else {
                            var ui = {
                                scripts:    [],
                                styles:     [],
                                depModules: []
                            };

                            for (var i=0; i < files.length; i++) {
                                if (files[i].name === 'ui-config.json') {
                                    var conf = JSON.parse(files[i].data);
                                    conf.scripts = conf.scripts || [];
                                    conf.styles  = conf.styles  || [];
                                    files.forEach(function (file) {
                                        conf.scripts.forEach(function (script) {
                                            console.log('script filename', file.name);
                                            console.log('script', script);
                                            if (file.name === script) {
                                                ui.scripts.push(file.data);
                                            }
                                        });
                                        conf.styles.forEach(function (style) {
                                            console.log('style filename', file.name);
                                            console.log('style', style);
                                            if (file.name === style) {
                                                ui.styles.push(file.data);
                                            }
                                        });
                                    });
                                    continue;
                                }

                                if (files[i].name === deployUnit.name+'.html') {
                                    ui.html = files[i].data;
                                }
                            }

                            if (ui.html) {
                                resolve(ui);
                            } else {
                                reject(new Error('Unable to load UI for '+deployUnit.name+'@'+deployUnit.version));
                            }
                        }
                    });
                }

                return $q(function (resolve, reject) {
                    if (devMode) {
                        kLogger.debug('KevoreeResolver', 'DevMode enabled: checking localhost:59000 before registry.npmjs.org');
                        $http
                            .get('http://localhost:59000/'+deployUnit.name+'/'+deployUnit.version+'/ui-config.json')
                            .then(
                            function (res) {
                                var conf = {
                                    depModules: res.data.depModules
                                };

                                res.data.scripts = res.data.scripts.map(function (path) {
                                    return 'http://localhost:59000/'+deployUnit.name+'/'+deployUnit.version+'/'+path;
                                });
                                res.data.styles = res.data.styles.map(function (path) {
                                    return 'http://localhost:59000/'+deployUnit.name+'/'+deployUnit.version+'/'+path;
                                });

                                async.map(res.data.scripts, httpGet, function (err, scripts) {
                                    if (err) {
                                        resolveProcess(resolve, reject);
                                    } else {
                                        conf.scripts = scripts;
                                        async.map(res.data.styles, httpGet, function (err, styles) {
                                            if (err) {
                                                resolveProcess(resolve, reject);
                                            } else {
                                                conf.styles = styles;
                                                $http
                                                    .get('http://localhost:59000/'+deployUnit.name+'/'+deployUnit.version+'/'+deployUnit.name+'.html')
                                                    .then(function (res) {
                                                        conf.html = res.data;
                                                        resolve(conf);
                                                    }, function () {
                                                        resolveProcess(resolve, reject);
                                                    });
                                            }
                                        });
                                    }
                                });
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
