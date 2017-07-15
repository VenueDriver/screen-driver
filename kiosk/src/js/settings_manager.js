'use strict';

const {LocalStorageManager, StorageNames} = require('./local_storage_manager');

class SettingsManager {

    static getCurrentSetting() {
        return new Promise((resolve, reject) => {
            LocalStorageManager.getFromStorage(StorageNames.SELECTED_SETTING_STORAGE, (error, data) => {
                return resolve(data);
            });
        });
    }
}

module.exports = SettingsManager;