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
                            TarGZ.load(
                                NPM_REGISTRY_URL.replace(/{name}/g, deployUnit.name).replace(/{version}/g, deployUnit.version),
                                function (files) {
                                    var js = null;
                                    async.each(
                                        files,
                                        function it(file, cb) {
                                            if (file.filename === 'package/'+duFile) {
                                                js = file.data;
                                            }

                                            if (file.filename.startsWith('package/browser/')) {
                                                kCache.add(
                                                    deployUnit,
                                                    file.filename.substr('package/browser/'.length, file.filename.length),
                                                    file.data,
                                                    cb);
                                            } else {
                                                cb();
                                            }
                                        },
                                        function result(err) {
                                            if (err) {
                                                reject(err);
                                            } else {
                                                // each file are cached now
                                                if (js) {
                                                    resolve(js);
                                                } else {
                                                    reject(new Error('Unable to find '+duFile+' for '+deployUnit.name+'@'+deployUnit.version));
                                                }
                                            }
                                        }
                                    );
                                },
                                null,
                                function (err) {
                                    reject(err);
                                });
                        } else {
                            var js = files[deployUnit.name+'.min.js'];
                            if (js) {
                                resolve(js);
                            } else {
                                reject(new Error('Unable to find cached '+duFile+' for '+deployUnit.name+'@'+deployUnit.version));
                            }
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
                            var rawConf = files['ui-config.json'];
                            var conf = {
                                scripts:    [],
                                styles:     [],
                                depModules: []
                            };
                            if (rawConf) {
                                conf = JSON.parse(rawConf);
                                conf.scripts = conf.scripts.map(function (script) {
                                    return files[script];
                                });
                                conf.styles = conf.styles.map(function (style) {
                                    return files[style];
                                });
                            }

                            conf.html = files[deployUnit.name+'.html'];

                            if (conf.html) {
                                resolve(conf);
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
