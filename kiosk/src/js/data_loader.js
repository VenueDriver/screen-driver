'use strict';

const {net} = require('electron');
const PropertiesLoader = require('./properties_loader');

class DataLoader {

    static loadVenues() {
        let api = PropertiesLoader.getApiEndpoint();
        let venuesUrl = `${api}/api/venues`;
        let request = net.request(venuesUrl);

        return new Promise((resolve, reject) => DataLoader.performRequest(request, resolve));
    }

    static performRequest(request, resolve) {
        request.on('response', response => {
            response.on('data', data => resolve(data.toString('utf8')))
        });
        request.end();
    }
}

module.exports = DataLoader;