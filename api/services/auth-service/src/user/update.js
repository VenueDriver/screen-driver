'use strict';
let User = require('./entities/user');
const ModulePathManager = require('../module_path_manager');
const TokenParser = require(ModulePathManager.getBasePath() + 'lib/auth_token/auth_token_parser');

const dynamodb = require('../dynamodb/dynamodb');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');
const _ = require('lodash');

module.exports.update = (event, context, callback) => {
    let token = event.headers.Authorization.replace('Bearer ', '');
    let decodedToken = TokenParser.decodeToken(token);
    let currentUser = new User({
        email: decodedToken.payload['cognito:username'],
        isAdmin: decodedToken.payload['custom:admin']
    });

    const data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    let user = new User(data, dynamodb);

    user.update(currentUser)
        .then(updatedUser => {
            callback(null, responseHelper.createSuccessfulResponse(updatedUser));
        })
        .fail(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, errorMessage));
        });
};
