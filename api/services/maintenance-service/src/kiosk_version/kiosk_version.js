'use strict';

const ModulePathManager = require('../module_path_manager');
const KioskVersionRegister = require('./helpers/kiosk_version_register');
const KioskVersionLoader = require('./helpers/kiosk_version_loader');

const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');

module.exports.register = (event, context, callback) => {
    const data = JSON.parse(event.body);

    KioskVersionRegister.registerVersion(data)
        .then(result => {
            callback(null, responseHelper.createSuccessfulResponse({}));
        })
        .fail(error => {
            callback(null, responseHelper.createResponseWithError(500, error))
        });

};

module.exports.getAll = (event, context, callback) => {
    KioskVersionLoader.getAllVersions()
        .then(result => {
            callback(null, responseHelper.createSuccessfulResponse(result));
        })
        .fail(error => {
            callback(null, responseHelper.createResponseWithError(500, error))
        });
};
