'use strict';

const ModulePathManager = require('../module_path_manager');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');
const UserDisableHelper = require('./helpers/user_disable_helper');

module.exports.handler = (event, context, callback) => {
    let userId = event.pathParameters.id;

    UserDisableHelper.disableUser(userId)
        .then(newUser => callback(null, responseHelper.createSuccessfulResponse(newUser)))
        .catch(errorMessage => callback(null, responseHelper.createResponseWithError(500, errorMessage)));
};
