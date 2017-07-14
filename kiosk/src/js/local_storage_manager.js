'use strict';

const storage = require('electron-json-storage');

const VENUES_STORAGE = 'venues';
const CONTENT_STORAGE = 'content';
const CONFIGS_STORAGE = 'config';

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
    VENUES_STORAGE: VENUES_STORAGE,
    CONTENT_STORAGE: CONTENT_STORAGE,
    CONFIGS_STORAGE: CONFIGS_STORAGE
};