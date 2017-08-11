'use strict';

const {net} = require('electron');
const PropertiesLoader = require('./helpers/properties_load_helper');
const StorageManager = require('./helpers/storage_manager');
const SettingMergeTool = require('./setting-merge-tool');
const API = PropertiesLoader.getApiEndpoint();

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
        let venuesUrl = `${API}/api/venues`;
        let request = net.request(venuesUrl);

        return DataLoader.generatePromise(request);
    }

    static loadContent() {
        let contentUrl = `${API}/api/content`;
        let request = net.request(contentUrl);

        return DataLoader.generatePromise(request);
    }

    static loadSettings() {
        let settingsUrl = `${API}/api/settings`;
        let request = net.request(settingsUrl);

        return DataLoader.generatePromise(request);
    }

    static loadNotificationsConfig() {
        let notificationsConfigUrl = `${API}/api/screens/notification-config`;
        let request = net.request(notificationsConfigUrl);

        return DataLoader.generatePromise(request);
    }

    static loadSchedules() {
        let settingsUrl = `${API}/api/schedules`;
        let request = net.request(settingsUrl);

        return DataLoader.generatePromise(request);
    }

    static generatePromise(request) {
        return new Promise((resolve, reject) => DataLoader.performRequest(request, resolve, reject));
    }

    static performRequest(request, resolve, reject) {
        request.on('response', response => {
            response.on('data', data => resolve(data.toString('utf8')));
            response.on('error', error => reject(error))
        });
        request.on('error', (error) => reject(error));
        request.end();
    }
}

module.exports = DataLoader;