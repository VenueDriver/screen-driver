'use strict';

const {LocalStorageManager, StorageNames} = require('./local_storage_helper');
const Storage = require('../storage/data_storage');

const _ = require('lodash');

class StorageManager {

    static getStorage() {
        return Storage;
    }

    static loadDataFromLocalStorage() {
        return new Promise((resolve, reject) => StorageManager.getAllFromStorage((error, data) => {
            if (_.isEmpty(data)) return;
            Storage.setServerData(data[StorageNames.SERVER_DATA_STORAGE]);
            Storage.setSelectedSetting(data[StorageNames.SELECTED_SETTING_STORAGE]);
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

    static saveScheduledTask(scheduledTask) {
        Storage.setScheduledTask(scheduledTask);
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

    static saveAutoupdateSchedule(schedule) {
        LocalStorageManager.getFromStorage(StorageNames.SERVER_DATA_STORAGE, (error, data) => {
            let autoupdateSchedules = data.updateSchedules;
            _.pullAllBy(autoupdateSchedules, [schedule], 'id');
            autoupdateSchedules.push(schedule);
            LocalStorageManager.putInStorage(StorageNames.SERVER_DATA_STORAGE, data);
        });
    }
}

module.exports = StorageManager;
