'use strict';

const ModulePathManager = require('../module_path_manager');
const ResponseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');
const UserPool = require(ModulePathManager.getBasePath() + 'lib/user_pool/user_pool');

module.exports.handler = (event, context, callback) => {
    const userDetails = JSON.parse(event.body);

    UserPool.authenticate(userDetails)
        .then(result => callback(null, ResponseHelper.createSuccessfulResponse(result)))
        .catch(err => callback(null, ResponseHelper.createResponseWithError(401, err)));
};