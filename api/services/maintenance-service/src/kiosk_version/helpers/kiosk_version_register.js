'use strict';

const ParametersBuilder = require('../helpers/parameters_builder');
const dbHelper = require('../../helpers/db_helper');

class KioskVersionRegister {

    static registerVersion(versionDetails) {
        let params = ParametersBuilder.buildPutRequestParameters(versionDetails);
        return dbHelper.putItem(params);
    }
}

module.exports = KioskVersionRegister;
