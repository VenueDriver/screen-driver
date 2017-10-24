'use strict';

const ModulePathManager = require('../module_path_manager');
const KioskVersionUtils = require('./helpers/kiosk_version_utils');

const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');

module.exports.register = (event, context, callback) => {
    const data = JSON.parse(event.body);

    KioskVersionUtils.registerVersion(data.screenId, data.version)
        .then(result => {
            callback(null, responseHelper.createSuccessfulResponse({}));
        })
        .fail(error => {
            callback(null, responseHelper.createResponseWithError(500, error))
        });

};
