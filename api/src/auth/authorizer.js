'use strict';

const TokenParser = require('../auth_token/auth_token_parser');
const ClientApp = require('../user_pool/client_app/client_app');
const PolicyGenerator = require('./policy_generator');
const AccessProvider = require('./access_provider');

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
