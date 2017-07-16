'use strict';

const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(__dirname + '/../../../config/app.properties');

class PropertiesLoader {

    static getApiEndpoint() {
        return properties.get('ScreenDriver.api.endpoint');
    }
}

module.exports = PropertiesLoader;