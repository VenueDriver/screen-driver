'use strict';

const ModulePathManager = require('../module_path_manager');
const UserPool = require('../user_pool/user_pool');
const ResponseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');
const TokenParser = require('../auth_token/auth_token_parser');

module.exports.handler = (event, context, callback) => {
    const userDetails = JSON.parse(event.body);
    let token = event.headers.authorization.replace('Bearer ', '');
    let decodedToken = TokenParser.decodeToken(token);
    userDetails.username = decodedToken.payload['cognito:username'];

    UserPool.signOut(userDetails);

    callback(null, ResponseHelper.createSuccessfulResponse({}))
};