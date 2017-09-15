'use strict';

const ModulePathManager = require('../module_path_manager');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');
const UserPool = require(ModulePathManager.getBasePath() + 'lib/user_pool/user_pool');

module.exports.changePassword = (event, context, callback) => {
    const data = JSON.parse(event.body);

    UserPool.changePassword(data)
        .then(() => callback(null, responseHelper.createSuccessfulResponse()))
        .catch(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, errorMessage))
        });
};
