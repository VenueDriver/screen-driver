'use strict';

const {LocalStorageManager, StorageNames} = require('./helpers/local_storage_helper');
const SettingsHelper = require('./helpers/settings_helper');
const DataLoader = require('./data_loader');

const _ = require('lodash');

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

    static reloadCurrentScreenConfig(setting) {
        return DataLoader.loadData()
            .then(data => {
                let contentUrl = SettingsHelper.defineContentUrl(data, setting);
                CurrentScreenSettingsManager.updateContentUrl(contentUrl, setting);
                return contentUrl;
            });
    }

    static updateContentUrl(contentUrl, setting) {
        if (contentUrl !== setting.contentUrl) {
            let newSetting = _.clone(setting);
            newSetting.contentUrl = contentUrl;
            CurrentScreenSettingsManager.saveCurrentSetting(newSetting);
        }
    }
}

module.exports = CurrentScreenSettingsManager;