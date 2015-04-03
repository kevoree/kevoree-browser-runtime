
angular.module('browserApp')
  .factory('kCache', function (Notification) {
    var fs = new Filer.FileSystem();
    var sh = new fs.Shell();
    sh.mkdirp('/js');
    sh.mkdirp('/html');

    function DeployUnitCacheManager() {
      this.cache = {};
    }

    DeployUnitCacheManager.prototype.addJs = function (du, js) {
      fs.writeFile('/js/'+du.name+'_'+du.version+'.js', js, function (err) {
        if (err) {
          console.warn('Unable to cache '+'/'+du.name+'_'+du.version+'.js'+' in FileSystem');
        }
      });
    };

    DeployUnitCacheManager.prototype.addUI = function (du, html) {
      fs.writeFile('/html/'+du.name+'_'+du.version+'.html', html, function (err) {
        if (err) {
          console.warn('Unable to cache '+'/'+du.name+'_'+du.version+'.html'+' in FileSystem');
        }
      });
    };

    DeployUnitCacheManager.prototype.getJs = function (du, callback) {
      fs.readFile('/js/'+du.name+'_'+du.version+'.js', 'utf8', callback);
    };

    DeployUnitCacheManager.prototype.getUI = function (du, callback) {
      fs.readFile('/html/'+du.name+'_'+du.version+'.html', 'utf8', callback);
    };

    DeployUnitCacheManager.prototype.clear = function (callback) {
      callback = callback || function () {};
      sh.rm('/js', { recursive: true }, function (err) {
        if (err) {
          console.warn('Something went wrong while cleaning DeployUnits /js cache');
        }

        sh.rm('/html', { recursive: true }, function (err) {
          if (err) {
            console.warn('Something went wrong while cleaning DeployUnits /html cache');
          }
          // re-create the roots folders
          sh.mkdirp('/js');
          sh.mkdirp('/html');
          Notification.success({
            title: 'DeployUnits cache',
            message: 'Cleared successfully',
            delay: 3000
          });
          callback();
        });
      });
    };
    DeployUnitCacheManager.prototype.getAll = function (callback) {
      var ret = [];
      sh.ls('/js', function (err, entries) {
        if (!err) {
          ret = ret.concat(entries);
        }
        sh.ls('/html', function (err, entries) {
          if (!err) {
            ret = ret.concat(entries);
          }
          callback(ret);
        });
      });
    };

    return new DeployUnitCacheManager();
  });
