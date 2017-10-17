'use strict';

const HttpClient = require('./helpers/http_client');
const SettingMergeTool = require('./setting-merge-tool');
const StorageManager = require('./helpers/storage_manager');
const PropertiesLoader = require('./helpers/properties_load_helper');

const API_ENDPOINT = PropertiesLoader.getApiEndpoint();

class DataLoader {

    static loadData() {
        let promises = [
            DataLoader.loadVenues(),
            DataLoader.loadContent(),
            DataLoader.loadSettings(),
            DataLoader.loadSchedules()
        ];

        return Promise.all(promises)
            .then(values => {
                let serverData = DataLoader.composeServerData(values);
                StorageManager.saveServerData(serverData);
                return serverData;
            });
    }

    static composeServerData(values) {
        let settings = JSON.parse(values[2]).settings;
        let serverData = {};
        serverData.venues = JSON.parse(values[0]);
        serverData.content = JSON.parse(values[1]);
        serverData.priorityTypes = JSON.parse(values[2]).priorityTypes;
        serverData.settings = this.mergeSettings(settings, serverData.priorityTypes);
        serverData.originalSettings = settings;
        serverData.schedules = JSON.parse(values[3]);
        return serverData;
    }

    static mergeSettings(settings, priorityTypes) {
        return SettingMergeTool
            .startMerging()
            .setSettings(settings)
            .setPriorities(priorityTypes)
            .mergeSettings();
    }

    static loadVenues() {
        let venuesUrl = `${API_ENDPOINT}/api/venues`;
        return HttpClient.get(venuesUrl);
    }

    static loadContent() {
        let contentUrl = `${API_ENDPOINT}/api/content`;
        return HttpClient.get(contentUrl);
    }

    static loadSettings() {
        let settingsUrl = `${API_ENDPOINT}/api/settings`;
        return HttpClient.get(settingsUrl);
    }

    static loadNotificationsConfig() {
        let notificationsConfigUrl = `${API_ENDPOINT}/api/screens/notification-config`;
        return HttpClient.get(notificationsConfigUrl);
    }

    static loadSchedules() {
        let settingsUrl = `${API_ENDPOINT}/api/schedules`;
        return HttpClient.get(settingsUrl);
    }
}

module.exports = DataLoader;