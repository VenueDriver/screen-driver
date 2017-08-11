'use strict';

const {LocalStorageManager, StorageNames} = require('./local_storage_helper');
const Storage = require('../storage/storage');

class StorageManager {

    static getStorage() {
        return Storage;
    }

    static loadDataFromLocalStorage() {
        return new Promise((resolve, reject) => StorageManager.getAllFromStorage((error, data) => {
            Storage.setServerData(data.server_data);
            Storage.setSelectedSetting(data.selected_setting);
            resolve(data);
        }));
    }

    static saveServerData(serverData) {
        StorageManager.putInStorage(StorageNames.SERVER_DATA_STORAGE, serverData);
        Storage.setServerData(serverData);
    }

    static saveSelectedSetting(selectedSetting) {
        StorageManager.putInStorage(StorageNames.SELECTED_SETTING_STORAGE, selectedSetting);
        Storage.setSelectedSetting(selectedSetting);
    }

    static putInStorage(key, value) {
        LocalStorageManager.putInStorage(key, value);
    }

    static getFromStorage(key, callback) {
        return LocalStorageManager.getFromStorage(key, callback);
    }

    static getAllFromStorage(callback) {
        return LocalStorageManager.getAllFromStorage(callback);
    }

    static hasStorage(key, callback) {
        return LocalStorageManager.hasStorage(key, callback);
    }
}

module.exports = StorageManager;