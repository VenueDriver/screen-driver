'use strict';

const storage = require('electron-json-storage');

const StorageNames = {
    SELECTED_SETTING_STORAGE: 'selected_setting'
};

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
    StorageNames: StorageNames
};