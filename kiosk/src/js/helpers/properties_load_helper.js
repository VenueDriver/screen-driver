'use strict';

const isDev = require('electron-is-dev');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(__dirname + '/../../../properties/app.properties');
const developmentProperties = PropertiesReader(__dirname + '/../../../properties/development.app.properties');

class PropertiesLoader {

    static getApiEndpoint() {
        return PropertiesLoader._getProperties().get('ScreenDriver.api.endpoint');
    }

    static _getProperties() {
        return isDev ? developmentProperties : properties;
    }
}

module.exports = PropertiesLoader;