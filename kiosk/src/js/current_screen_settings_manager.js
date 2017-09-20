'use strict';

const {LocalStorageManager} = require('./helpers/local_storage_helper');
const {scheduledTaskManager, isScheduled} = require('./scheduled-task-manager');
const StorageManager = require('./helpers/storage_manager');
const SettingsHelper = require('./helpers/settings_helper');
const DataLoader = require('./data_loader');
const WindowInstanceHolder = require('./window-instance-holder');

const _ = require('lodash');

class CurrentScreenSettingsManager {

    static getCurrentSetting() {
        return StorageManager.getStorage().getSelectedSetting();
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
        if (contentUrl !== setting.contentUrl) {
            let newSetting = _.clone(setting);
            newSetting.contentUrl = contentUrl;
            CurrentScreenSettingsManager.saveCurrentSetting(newSetting);
        }
    }

    static changeScreenConfiguration() {
        let screenInformation = CurrentScreenSettingsManager.getCurrentSetting();
        this.reloadCurrentScreenConfig(screenInformation).then((contentUrl) => {
            scheduledTaskManager.initSchedulingForScreen(screenInformation);

            let currentUrl = this._cutSlashAtTheEndOfUrl(WindowInstanceHolder.getWindow().getURL());
            let newUrl = this._cutSlashAtTheEndOfUrl(contentUrl);
            if (!isScheduled() && currentUrl != newUrl) {
                this._applyNewUrl(screenInformation, newUrl);
            }
        })
    }

    static _applyNewUrl(screenInformation, newUrl) {
        screenInformation.contentUrl = newUrl;
        CurrentScreenSettingsManager.saveCurrentSetting(screenInformation);
        WindowInstanceHolder.getWindow().loadURL(screenInformation.contentUrl);
    }

    static _cutSlashAtTheEndOfUrl(url) {
        return url.lastIndexOf('/') == url.length - 1 ? url.slice(0, -1) : url;
    }
}

module.exports = CurrentScreenSettingsManager;
