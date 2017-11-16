'use strict';

const ModulePathManager = require('../module_path_manager');
const dynamodb = require('../dynamodb/dynamodb');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');
const UserPool = require('../user_pool/user_pool');
const TokenParser = require(ModulePathManager.getBasePath() + 'lib/auth_token/auth_token_parser');

let User = require('./entities/user');

module.exports.edit = (event, context, callback) => {
    const userDetails = JSON.parse(event.body);
    let currentUser = extractCurrentUserFromEvent(event);
    userDetails.username = currentUser.username;
    userDetails.isAdmin = currentUser.isAdmin;

    changeEmail(userDetails, callback);
};

module.exports.changePassword = (event, context, callback) => {
    const changePasswordDetails = JSON.parse(event.body);
    changePassword(changePasswordDetails, callback);
};

function changePassword(changePasswordDetails, callback) {
    UserPool.changePassword(changePasswordDetails)
        .then(() => callback(null, responseHelper.createSuccessfulResponse()))
        .catch(errorMessage => {
            console.error(errorMessage);
            callback(null, responseHelper.createResponseWithError(500, errorMessage))
        });
}

function changeEmail(userDetails, callback) {
    let user = new User(userDetails, dynamodb);
    user.changeEmail()
        .then(updatedUser => callback(null, responseHelper.createSuccessfulResponse(updatedUser)))
        .fail(errorMessage => {
            console.error(errorMessage);
            callback(null, responseHelper.createResponseWithError(500, errorMessage));
        });
}

function extractCurrentUserFromEvent(event) {
    let token = getAuthorizationToken(event);
    let decodedToken = TokenParser.decodeToken(token);
    return new User({
        username: decodedToken.payload['cognito:username'],
        email: decodedToken.payload['email'],
        isAdmin: decodedToken.payload['custom:admin']
    });
}

function getAuthorizationToken(event) {
    let headers = event.headers;
    let token = headers.Authorization ? headers.Authorization : headers.authorization;
    return token.replace('Bearer ', '');
}
