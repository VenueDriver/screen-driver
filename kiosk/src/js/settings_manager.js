'use strict';

const {LocalStorageManager, StorageNames} = require('./local_storage_manager');

class SettingsManager {

    static getCurrentSetting() {
        return new Promise((resolve, reject) => {
            LocalStorageManager.getFromStorage(StorageNames.SETTINGS_STORAGE, (error, data) => {
                let settings = JSON.parse(data);
                resolve(settings[0]);
            });
        });
    }
}

module.exports = SettingsManager;