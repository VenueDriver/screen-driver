'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const AWSCognito = require('amazon-cognito-identity-js');

const UserPoolHelper = require('./user_pool_helper');

module.exports.createUser = (userData) => {
    let cognito = new AWS.CognitoIdentityServiceProvider();

    let userPoolParams = UserPoolHelper.buildCreateUserParameters(userData);
    return new Promise((resolve, reject) => {
        cognito.adminCreateUser(userPoolParams, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.User);
            }
        });
    });
};

module.exports.authenticate = (userDetails) => {
    let authenticationDetails = getAuthenticationDetails(userDetails);
    let cognitoUser = getCognitoUser(userDetails);

    return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function(result) {
                let token = `Bearer ${result.idToken.jwtToken}`;
                let refreshToken = `Bearer ${result.refreshToken.token}`;
                resolve({
                    token: token,
                    refreshToken: refreshToken
                });
            },

            onFailure: function(error) {
                reject(error);
            },

            newPasswordRequired: function(userAttributes, requiredAttributes) {
                delete userAttributes.email_verified;
                cognitoUser.completeNewPasswordChallenge(userDetails.newPassword, userAttributes, this);
            }
        });
    });
};

module.exports.signOut = (userDetails) => {
    let cognitoUser = getCognitoUser(userDetails);
    cognitoUser.signOut();
};

function getAuthenticationDetails(userDetails) {
    let authenticationData = {
        Username : userDetails.email,
        Password : userDetails.password,
    };
    return new AWSCognito.AuthenticationDetails(authenticationData);
}

function getUserPool() {
    let poolData = UserPoolHelper.buildUserPoolData();
    return new AWSCognito.CognitoUserPool(poolData);
}

function getCognitoUser(userDetails) {
    let userPool = getUserPool();
    let userData = {
        Username: userDetails.email,
        Pool: userPool
    };
    return new AWSCognito.CognitoUser(userData);
}