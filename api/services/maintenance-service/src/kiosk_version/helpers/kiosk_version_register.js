'use strict';

const ParametersBuilder = require('../helpers/parameters_builder');
const dbHelper = require('../../helpers/db_helper');

class KioskVersionRegister {

    static registerVersion(screenId, version) {
        let params = ParametersBuilder.buildPutRequestParameters(screenId, version);
        return dbHelper.putItem(params);
    }
}

module.exports = KioskVersionRegister;
