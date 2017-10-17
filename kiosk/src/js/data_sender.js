'use strict';
const app = require('electron').app;
const HttpClient = require('./helpers/http_client');
const PropertiesLoader = require('./helpers/properties_load_helper');

const API_ENDPOINT = PropertiesLoader.getApiEndpoint();

class DataSender {

    static sendApplicationVersion() {
        let settingsUrl = `${API_ENDPOINT}/api/screens/version`;
        return HttpClient.post(settingsUrl, app.getVersion());
    }
}

module.exports = DataSender;
