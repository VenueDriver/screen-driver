'use strict';

const ModulePathManager = require('../module_path_manager');
const TokenParser = require(ModulePathManager.getBasePath() + 'lib/auth_token/auth_token_parser');
const ClientApp = require(ModulePathManager.getBasePath() + 'lib/user_pool/client_app/client_app');
const PolicyGenerator = require(ModulePathManager.getBasePath() + 'lib/auth/policy_generator');
const AccessProvider = require(ModulePathManager.getBasePath() + 'lib/auth/access_provider');

module.exports.handler = (event, context, callback) => {
    let idToken = getTokenFromHeader(event);
    let decodedToken = TokenParser.decodeToken(idToken);

    ClientApp.loadKeySet(decodedToken.payload.iss)
        .then(pems => {
            let pem = pems[decodedToken.header.kid];
            TokenParser.verifyToken(idToken, pem);
            AccessProvider.hasAccessToResource(decodedToken, event.methodArn);

            callback(null, PolicyGenerator.generateAllowPolicy(decodedToken.payload.email, event.methodArn));
        })
        .catch(err => {
            console.error(err);
            callback(null, PolicyGenerator.generateDenyPolicy(decodedToken.payload.email, event.methodArn));
        });
};

function getTokenFromHeader(event) {
    let authorizationHeader = event.authorizationToken;
    return authorizationHeader.replace('Bearer ', '');
}
