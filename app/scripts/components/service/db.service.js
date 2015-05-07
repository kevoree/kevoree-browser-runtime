angular.module('browserApp')
    .service('db', function () {
        Dexie.Promise.on('error', function(err) {
            // Log to console or show en error indicator somewhere in your GUI...
            console.warn("[service] db " + err);
        });

        var db = new Dexie('kevoree-browser-runtime');
        db.version(1).stores({
            deployUnit: '[name+version],files'
        });
        db.open();

        return db;
    });
