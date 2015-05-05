angular.module('browserApp')
    .service('KevoreeResolver', function ($http, $q, kCache, kLogger, storage, NPM_REGISTRY_URL) {
        var LS_DEV_MODE = 'dev_mode';

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
                        if (err || Object.keys(files).length === 0) {
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

                                if (!conf.layout) {
                                    conf.layout = { width: 1, height: 1 };
                                } else {
                                    if (!conf.layout.width) {
                                        conf.layout.width = 1;
                                    }

                                    if (!conf.layout.height) {
                                        conf.layout.height = 1;
                                    }
                                }
                                
                                conf.scripts = conf.scripts || [];
                                conf.styles = conf.styles || [];
                                conf.depModules = conf.depModules || [];
                                conf.scripts = conf.scripts.map(function (script) {
                                    if (script.startsWith('//') || script.startsWith('http://') || script.startsWith('https://')) {
                                        return '<script src="'+script+'" type="application/javascript">';
                                    } else {
                                        return '<script type="application/javascript">'+files[script]+'</script>';
                                    }
                                });
                                conf.styles = conf.styles.map(function (style) {
                                    if (style.startsWith('//') || style.startsWith('http://') || style.startsWith('https://')) {
                                        return '<link rel="stylesheet" href="'+style+'" type="text/css">';
                                    } else {
                                        return '<style type="text/css">'+files[style]+'</style>';
                                    }
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
                                if (!res.data.layout) {
                                    res.data.layout = { width: 1, height: 1 };
                                } else {
                                    if (!res.data.layout.width) {
                                        res.data.layout.width = 1;
                                    }

                                    if (!res.data.layout.height) {
                                        res.data.layout.height = 1;
                                    }
                                }
                                res.data.scripts = res.data.scripts || [];
                                res.data.styles = res.data.styles || [];
                                res.data.depModules = res.data.depModules || [];

                                res.data.scripts = res.data.scripts.map(function (path) {
                                    if (path.startsWith('//') || path.startsWith('http://') || path.startsWith('https://')) {
                                        return '<script src="'+path+'" type="application/javascript"></script>';
                                    } else {
                                        return '<script src="http://localhost:59000/'+deployUnit.name+'/'+deployUnit.version+'/'+path+'"></script>';
                                    }
                                });
                                res.data.styles = res.data.styles.map(function (path) {
                                    if (path.startsWith('//') || path.startsWith('http://') || path.startsWith('https://')) {
                                        return '<link href="'+path+'" type="text/css" rel="stylesheet">';
                                    } else {
                                        return '<link href="http://localhost:59000/'+deployUnit.name+'/'+deployUnit.version+'/'+path+'" type="text/css" rel="stylesheet">';
                                    }
                                });

                                $http
                                    .get('http://localhost:59000/'+deployUnit.name+'/'+deployUnit.version+'/'+deployUnit.name+'.html')
                                    .then(function (response) {
                                        res.data.html = response.data;
                                        resolve(res.data);
                                    }, function () {
                                        resolveProcess(resolve, reject);
                                    });
                            },
                            function () {
                                $http
                                    .get('http://localhost:59000/'+deployUnit.name+'/'+deployUnit.version+'/'+deployUnit.name+'.html')
                                    .then(function (res) {
                                        resolve({ html: res.data, scripts: [], styles: [], depModules: [] });
                                    }, function () {
                                        resolveProcess(resolve, reject);
                                    });
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
