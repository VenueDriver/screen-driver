'use strict';

const {net} = require('electron');
const PropertiesLoader = require('./properties_loader');
const API = PropertiesLoader.getApiEndpoint();
const {LocalStorageManager, StorageNames} = require('./local_storage_manager');

class DataLoader {

    static loadData() {
        DataLoader.loadVenues();
        DataLoader.loadContent();
        DataLoader.loadConfigs();
    }

    static loadVenues() {
        let venuesUrl = `${API}/api/venues`;
        let request = net.request(venuesUrl);

        DataLoader.generatePromise(request)
            .then(data => {
                LocalStorageManager.putInStorage(StorageNames.VENUES_STORAGE, data);
            })
            .catch(error => console.log(error));
    }

    static loadContent() {
        let contentUrl = `${API}/api/content`;
        let request = net.request(contentUrl);

        DataLoader.generatePromise(request)
            .then(data => {
                LocalStorageManager.putInStorage(StorageNames.CONTENT_STORAGE, data);
            })
            .catch(error => console.log(error));
    }

    static loadConfigs() {
        let contentUrl = `${API}/api/configs`;
        let request = net.request(contentUrl);

        DataLoader.generatePromise(request)
            .then(data => {
                LocalStorageManager.putInStorage(StorageNames.SETTINGS_STORAGE, data);
            })
            .catch(error => console.log(error));
    }

    static generatePromise(request) {
        return new Promise((resolve, reject) => DataLoader.performRequest(request, resolve, reject));
    }

    static performRequest(request, resolve, reject) {
        request.on('response', response => {
            response.on('data', data => resolve(data.toString('utf8')));
            response.on('error', error => reject(error))
        });
        request.end();
    }
}

module.exports = DataLoader;