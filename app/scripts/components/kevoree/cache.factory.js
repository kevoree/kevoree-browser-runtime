angular.module('browserApp')
    .factory('kCache', function (Notification) {
      var ROOT_PATH = '/deployUnits';

      var fs = new Filer.FileSystem();
      var sh = new fs.Shell();
      sh.mkdirp(ROOT_PATH);

      function DeployUnitCacheManager() {
        this.memCache = {};
      }

      DeployUnitCacheManager.prototype = {
        /**
         * Saves the given DeployUnit (du) filename data to the cache
         * @param du
         * @param filename
         * @param data
         * @param callback
         */
        add: function (du, filename, data, callback) {
          callback = callback || function () { /* noop */ };
          var fullpath = ROOT_PATH+'/'+du.name+'/'+du.version+'/'+filename;
          var parentDir = fullpath.substr(0, fullpath.lastIndexOf('/'));
          sh.mkdirp(parentDir, function (err) {
            if (err) {
              callback(new Error('Unable to create directories '+parentDir));
            } else {
              fs.writeFile(fullpath, data, function (err) {
                if (err) {
                  callback(new Error('Unable to cache deploy unit '+du.name+'@'+du.version+' in the browser filesystem'));
                } else {
                  this.memCache[du.name+'_'+du.version] = this.memCache[du.name+'_'+du.version] || {};
                  this.memCache[du.name+'_'+du.version][filename] = data;
                  callback();
                }
              }.bind(this));
            }
          }.bind(this));
        },

        /**
         * Gets the given DeployUnit (du) cached entries in the filesystem
         * @param du
         * @param callback
         */
        get: function (du, callback) {
          if (this.memCache[du.name+'_'+du.version]) {
            callback(null, this.memCache[du.name+'_'+du.version]);
          } else {
            var dir = ROOT_PATH+'/'+du.name+'/'+du.version;
            sh.ls(dir, { recursive: true }, function (err, entries) {
              if (err) {
                callback(new Error('Unable to browse the filesystem cache at '+dir));
              } else {
                function flatten(entries, prepend) {
                  var ret = [];
                  entries.forEach(function (entry) {
                    if (entry.type === 'FILE') {
                      entry.path = prepend+entry.path;
                      ret.push(entry);
                    } else {
                      var res = flatten(entry.contents, prepend+entry.path+'/');
                      ret = ret.concat(res);
                    }
                  });
                  return ret;
                }

                entries = flatten(entries, '');
                async.map(
                    entries,
                    function it(entry, cb) {
                      fs.readFile(dir+'/'+entry.path, 'utf8', function (err, data) {
                        cb(err, { name: entry.path, data: data });
                      });
                    },
                    function (err, files) {
                      if (err) {
                        callback(err);
                      } else {
                        this.memCache[du.name+'_'+du.version] = {};
                        files.forEach(function (file) {
                          this.memCache[du.name+'_'+du.version][file.name] = file.data;
                        }.bind(this));
                        callback(null, this.memCache[du.name+'_'+du.version]);
                      }
                    }.bind(this)
                );
              }
            }.bind(this));
          }
        },

        /**
         * Retrieves all the entries from the filesystem cache
         * @param callback
         */
        getAll: function (callback) {
          sh.ls(ROOT_PATH, { recursive: true }, function (err, entries) {
            if (err) {
              callback(new Error('Unable to browse the filesystem cache at '+ROOT_PATH));
            } else {
              callback(null, entries);
            }
          });
        },

        /**
         * Clears the filesystem cache content
         * @param callback
         */
        clear: function (callback) {
          callback = callback || function () { /* noop */ };
          sh.rm(ROOT_PATH, { recursive: true }, function (err) {
            if (err) {
              callback(new Error('Something went wrong while cleaning DeployUnits cache at '+ROOT_PATH));
            } else {
              // re-create the roots folders
              Notification.success({
                title: 'DeployUnits cache',
                message: 'Cleared successfully',
                delay: 3000
              });
              callback();
            }
          });
        }
      };

      return new DeployUnitCacheManager();
    });
