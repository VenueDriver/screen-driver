'use strict';

const TokenParser = require('../auth_token/auth_token_parser');
const ClientApp = require('../user_pool/client_app/client_app');

module.exports.handler = (event, context, callback) => {
    let idToken = event.authorizationToken;
    let decodedToken = TokenParser.decodeToken(idToken);

    ClientApp.loadKeySet(decodedToken.payload.iss)
        .then(pems => {
            let pem = pems[decodedToken.header.kid];
            let payload = TokenParser.verifyToken(idToken, pem);

            callback(null, generatePolicy('user', 'Allow', event.methodArn));
        })
        .catch(err => {
            callback(null, generatePolicy('user', 'Deny', event.methodArn));
        });
};

let generatePolicy = function(principalId, effect, resource) {
    let authResponse = {};

    authResponse.principalId = principalId;
    if (effect && resource) {
        let policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        let statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }

    return authResponse;
};
