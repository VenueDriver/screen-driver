'use strict';

const KioskVersionRegister = require('./helpers/kiosk_version_register');
const KioskVersionLoader = require('./helpers/kiosk_version_loader');

const responseHelper = require('lib/helpers/http_response_helper');

module.exports.register = (event, context, callback) => {
    const versionDetails = JSON.parse(event.body);

    KioskVersionRegister.registerVersion(versionDetails)
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
