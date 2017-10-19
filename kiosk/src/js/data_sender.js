'use strict';
const app = require('electron').app;
const CurrentScreenSettingsManager = require('./current_screen_settings_manager');
const HttpClient = require('./helpers/http_client');
const PropertiesLoader = require('./helpers/properties_load_helper');
const ConnectionStatusService = require('./services/network/connection_status_service');

const API_ENDPOINT = PropertiesLoader.getApiEndpoint();

class DataSender {

    static sendApplicationVersion() {
        let settingsUrl = `${API_ENDPOINT}/api/screens/version`;
        let screenId = CurrentScreenSettingsManager.getCurrentSetting().selectedScreenId;
        let appVersion = app.getVersion();
        let requestData = {screenId: screenId, version: appVersion || '0.0.0'};

        if (!screenId) throw new Error('Couldn\'t send Kiosk version. Reason: missed screen id');

        ConnectionStatusService.runWhenPossible(() => {
            HttpClient.post(settingsUrl, requestData);
        });
    }
}

module.exports = DataSender;
