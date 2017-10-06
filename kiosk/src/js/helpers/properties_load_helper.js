'use strict';

const isDev = require('electron-is-dev');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(__dirname + '/../../../properties/app.properties');

class PropertiesLoader {

    static getApiEndpoint() {
        return PropertiesLoader._getProperties().get('ScreenDriver.api.endpoint');
    }

    static getWindowsUpdateEndpoint() {
        return PropertiesLoader._getProperties().get('ScreenDriver.kiosk.update-endpoint.windows');
    }

    static _getProperties() {
        if (isDev) {
            return PropertiesReader(__dirname + '/../../../properties/development.app.properties');
        }
        return properties;
    }
}

module.exports = PropertiesLoader;