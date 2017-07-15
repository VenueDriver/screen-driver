'use strict';

const {LocalStorageManager, StorageNames} = require('./local_storage_manager');

class CurrentScreenSettingsManager {

    static getCurrentSetting() {
        return new Promise((resolve, reject) => {
            LocalStorageManager.getFromStorage(StorageNames.SELECTED_SETTING_STORAGE, (error, data) => {
                return resolve(data);
            });
        });
    }

    static saveCurrentSetting(selectedSetting) {
        LocalStorageManager.putInStorage(StorageNames.SELECTED_SETTING_STORAGE, selectedSetting);
    }
}

module.exports = CurrentScreenSettingsManager;