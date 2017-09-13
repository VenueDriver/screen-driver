'use strict';

const STATEMENT = {
    Action: 'execute-api:Invoke'
};

const POLICY_DOCUMENT = {
    Version: '2012-10-17',
    Statement: [
        STATEMENT
    ]
};

module.exports.generateDenyPolicy = (principalId, resource) => {
    return generatePolicy(principalId, 'Deny', resource);
};

module.exports.generateAllowPolicy = (principalId, resource) => {
    return generatePolicy(principalId, 'Allow', resource);
};

function generatePolicy(principalId, effect, resource) {
    let authResponse = {};

    authResponse.principalId = principalId;
    if (effect && resource) {
        STATEMENT.Effect = effect;
        STATEMENT.Resource = resource;
        authResponse.policyDocument = POLICY_DOCUMENT;
    }

    return authResponse;
}