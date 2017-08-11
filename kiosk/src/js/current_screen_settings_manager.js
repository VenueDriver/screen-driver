'use strict';

const {LocalStorageManager, StorageNames} = require('./helpers/local_storage_helper');
const StorageManager = require('./helpers/storage_manager');
const ScheduleMergeTool = require('./schedule-merge-tool');
const SettingsHelper = require('./helpers/settings_helper');
const DataLoader = require('./data_loader');

const _ = require('lodash');

class CurrentScreenSettingsManager {

    static getCurrentSetting() {
        return new Promise((resolve, reject) => {
            let currentSetting = StorageManager.getStorage().getSelectedSetting();
            resolve(currentSetting);
        });
    }

    static saveCurrentSetting(selectedSetting) {
        StorageManager.saveSelectedSetting(selectedSetting);
    }

    static reloadCurrentScreenConfig(setting) {
        return DataLoader.loadData()
            .then(data => {
                let convertedSetting = CurrentScreenSettingsManager.convert(data, setting);

                let contentUrl = SettingsHelper.defineContentUrl(data, convertedSetting);
                CurrentScreenSettingsManager.updateContentUrl(contentUrl, convertedSetting);
                LocalStorageManager.removeUnusedStorage();
                return contentUrl;
            });
    }

    static convert(data, setting) {
        if (!setting.selectedScreen) {
            return setting;
        }
        let venue = _.find(data.venues, v => v.name === setting.selectedVenue);
        let group = _.find(venue.screen_groups, g => g.name === setting.selectedGroup);
        let screen = _.find(group.screens, s => s.name === setting.selectedScreen);
        return {
            contentUrl: setting.contentUrl,
            selectedScreenId: screen.id,
            selectedGroupId: group.id,
            selectedVenueId: venue.id
        };
    }

    static updateContentUrl(contentUrl, setting) {
        if (contentUrl !== setting.contentUrl || LocalStorageManager.hasStorage(StorageNames.SELECTED_SCREEN_STORAGE)) {
            let newSetting = _.clone(setting);
            newSetting.contentUrl = contentUrl;
            CurrentScreenSettingsManager.saveCurrentSetting(newSetting);
        }
    }
}

module.exports = CurrentScreenSettingsManager;
