'use strict';

const {net} = require('electron');
const PropertiesLoader = require('./properties_loader');
const API = PropertiesLoader.getApiEndpoint();

class DataLoader {

    static loadData() {
        let promises = [
            DataLoader.loadVenues(),
            DataLoader.loadContent(),
            DataLoader.loadConfigs()
        ];

        return Promise.all(promises)
            .then(values => DataLoader.composeServerData(values));
    }

    static composeServerData(values) {
        let serverData = {};
        serverData.venues = JSON.parse(values[0]);
        serverData.content = JSON.parse(values[1]);
        serverData.settings = JSON.parse(values[2]);
        return serverData;
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

    static loadConfigs() {
        let contentUrl = `${API}/api/configs`;
        let request = net.request(contentUrl);

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
        request.end();
    }
}

module.exports = DataLoader;