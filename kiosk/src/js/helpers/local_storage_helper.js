'use strict';

const storage = require('electron-json-storage');

const StorageNames = {
    SELECTED_SETTING_STORAGE: 'selected_setting',
    SERVER_DATA_STORAGE: 'server_data',
    SCHEDULED_TASK_STORAGE: 'scheduled_task',
    SELECTED_SCREEN_STORAGE: 'selectedScreen',
    SELECTED_GROUP_STORAGE: 'selectedGroup',
    SELECTED_VENUE_STORAGE: 'selectedVenue',
    CONTENT_URL_STORAGE: 'contentUrl'
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

    static getAllFromStorage(callback) {
        return storage.getAll(callback);
    }

    static hasStorage(key, callback) {
        return storage.has(key, callback);
    }

    static removeUnusedStorage() {
        LocalStorageManager.hasStorage(StorageNames.SELECTED_SCREEN_STORAGE, (error, hasKey) => {
            if (hasKey) {
                storage.remove(StorageNames.SELECTED_SCREEN_STORAGE);
                storage.remove(StorageNames.SELECTED_GROUP_STORAGE);
                storage.remove(StorageNames.SELECTED_VENUE_STORAGE);
                storage.remove(StorageNames.CONTENT_URL_STORAGE);
            }
        });
    }
}

module.exports = {
    LocalStorageManager: LocalStorageManager,
    StorageNames: StorageNames
};