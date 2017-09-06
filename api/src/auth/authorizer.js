'use strict';

const TokenParser = require('../auth_token/auth_token_parser');
const ClientApp = require('../user_pool/client_app/client_app');
const PolicyGenerator = require('./policy_generator');

module.exports.handler = (event, context, callback) => {
    let idToken = event.authorizationToken;
    let decodedToken = TokenParser.decodeToken(idToken);

    ClientApp.loadKeySet(decodedToken.payload.iss)
        .then(pems => {
            let pem = pems[decodedToken.header.kid];
            TokenParser.verifyToken(idToken, pem);

            callback(null, PolicyGenerator.generateAllowPolicy(decodedToken.payload.email, event.methodArn));
        })
        .catch(err => {
            console.error(err);
            callback(null, PolicyGenerator.generateDenyPolicy(decodedToken.payload.email, event.methodArn));
        });
};
