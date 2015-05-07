angular.module('browserApp')
    .factory('kCache', function (db, Notification) {
      function DeployUnitCacheManager() {
        this.memCache = {};
      }

      DeployUnitCacheManager.prototype = {
        /**
         * Saves the given DeployUnit (du) files to cache
         * @param du
         * @param files
         * @param callback
         */
        add: function (du, files, callback) {
          callback = callback || function () { /* noop */ };
          console.log('add', du.name, du.version, files);

          db.deployUnit
              .put({
                name: du.name,
                version: du.version,
                files: files
              })
              .then(function () {
                callback();
              })
              .catch(function (err) {
                callback(err);
              });
        },

        /**
         * Gets the given DeployUnit (du) cached entries in the filesystem
         * @param du
         * @param callback
         */
        get: function (du, callback) {
          callback = callback || function () { /* noop */ };
          console.log('get', du.name, du.version);

          db.deployUnit
              .where('[name+version]')
              .equals([du.name, du.version])
              .toArray(function (results) {
                if (results.length === 0) {
                  callback(null, {});
                } else {
                  callback(null, results[0].files);
                }
              })
              .catch(function (err) {
                callback(err);
              });
        },

        /**
         * Retrieves all the entries from the filesystem cache
         * @param callback
         */
        getAll: function (callback) {
          callback = callback || function () { /* noop */ };
          db.deployUnit
              .toArray(function (results) {
                callback(null, results);
              })
              .catch(function (err) {
                callback(err);
              });
        },

        /**
         * Clears the filesystem cache content
         * @param callback
         */
        clear: function (callback) {
          callback = callback || function () { /* noop */ };
          db.deployUnit
              .toCollection()
              .delete()
              .then(function() {
                Notification.success({
                  title: 'DeployUnits cache',
                  message: 'Cleared successfully',
                  delay: 3000
                });
                callback();
              })
              .catch(function (err) {
                Notification.error({
                  title: 'DeployUnits cache',
                  message: 'Unable to clear cache',
                  delay: 3000
                });
                callback(err);
              });
        }
      };

      return new DeployUnitCacheManager();
    });
