'use strict';

const ModulePathManager = require('../module_path_manager');
const UserPool = require('../user_pool/user_pool');
const ResponseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');
const TokenParser = require(ModulePathManager.getBasePath() + 'lib/auth_token/auth_token_parser');

module.exports.handler = (event, context, callback) => {
    const userDetails = JSON.parse(event.body);
    let token = getAuthorizationToken(event);
    let decodedToken = TokenParser.decodeToken(token);
    userDetails.username = decodedToken.payload['cognito:username'];

    UserPool.signOut(userDetails);

    callback(null, ResponseHelper.createSuccessfulResponse({}))
};

function getAuthorizationToken(event) {
    let headers = event.headers;
    let token = headers.Authorization ? headers.Authorization : headers.authorization;
    return token.replace('Bearer ', '');
}
