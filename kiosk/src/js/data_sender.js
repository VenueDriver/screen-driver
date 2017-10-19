'use strict';
const CurrentScreenSettingsManager = require('./current_screen_settings_manager');
const HttpClient = require('./helpers/http_client');
const PropertiesLoader = require('./helpers/properties_load_helper');
const ConnectionStatusService = require('./services/network/connection_status_service');

const API_ENDPOINT = PropertiesLoader.getApiEndpoint();

class DataSender {

    static sendApplicationVersion(requestData) {
        let settingsUrl = `${API_ENDPOINT}/api/screens/version`;

        ConnectionStatusService.runWhenPossible(() => {
            HttpClient.post(settingsUrl, requestData);
        });
    }
}

module.exports = DataSender;
