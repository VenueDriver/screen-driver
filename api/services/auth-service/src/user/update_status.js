'use strict';

const ModulePathManager = require('../module_path_manager');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');
const UserDisableHelper = require('./helpers/user_status_helper');
const TokenParser = require(ModulePathManager.getBasePath() + 'lib/auth_token/auth_token_parser');

module.exports.handler = (event, context, callback) => {
    let userId = event.pathParameters.id;
    let currentUserDetails = TokenParser.getCurrentUserDetails(event);

    const data = JSON.parse(event.body);

    UserDisableHelper.init(userId, currentUserDetails)
        .updateStatus(data.enabled)
        .then(() => callback(null, responseHelper.createSuccessfulResponse({})))
        .catch(errorMessage => callback(null, responseHelper.createResponseWithError(500, errorMessage)));
};