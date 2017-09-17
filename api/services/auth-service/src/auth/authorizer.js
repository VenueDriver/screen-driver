'use strict';

const ModulePathManager = require('../module_path_manager');
const TokenParser = require(ModulePathManager.getBasePath() + 'lib/auth_token/auth_token_parser');
const KeysLoader = require(ModulePathManager.getBasePath() + 'lib/auth/keys_loader');
const PolicyGenerator = require(ModulePathManager.getBasePath() + 'lib/auth/policy_generator');
const AccessProvider = require(ModulePathManager.getBasePath() + 'lib/auth/access_provider');

module.exports.handler = (event, context, callback) => {

    try {

        let idToken = getTokenFromHeader(event);
        console.log('idToken', idToken);

        let decodedToken = TokenParser.decodeToken(idToken);
        console.log(decodedToken);

        KeysLoader.loadKeySet(decodedToken.payload.iss)
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

    } catch (error) {
        console.error(error)
    }
};

function getTokenFromHeader(event) {
    let authorizationHeader = event.authorizationToken;
    return authorizationHeader.replace('Bearer ', '');
}
