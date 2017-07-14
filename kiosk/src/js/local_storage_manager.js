'use strict';

const storage = require('electron-json-storage');

const VENUES_STORAGE = 'venues';

class LocalStorageManager {

    static putInStorage(key, value) {
        storage.set(key, value, function(error) {
            if (error) throw error;
        });
    }

    static getFromStorage(key, callback) {
        return storage.get(key, callback);
    }
}

module.exports = {
    LocalStorageManager: LocalStorageManager,
    VENUES_STORAGE: VENUES_STORAGE
};