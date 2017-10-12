'use strict';

const User = require('./entities/user');
const ModulePathManager = require('../module_path_manager');
const TokenParser = require(ModulePathManager.getBasePath() + 'lib/auth_token/auth_token_parser');

const dynamodb = require('../dynamodb/dynamodb');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');
const requestHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_request_helper');

module.exports.update = (event, context, callback) => {
    let currentUserDetails = TokenParser.getCurrentUserDetails(requestHelper.getAuthorizationToken(event));

    const data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    let user = new User(data, dynamodb);

    user.update(currentUserDetails)
        .then(updatedUser => {
            callback(null, responseHelper.createSuccessfulResponse(updatedUser));
        })
        .fail(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, errorMessage));
        });
};
