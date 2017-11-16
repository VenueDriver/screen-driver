'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION});

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
    let cognitoUser = this.getCognitoUser(userDetails);

    return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                resolve(buildResponseWithTokens(result));
            },

            onFailure: function (error) {
                reject(error);
            },

            newPasswordRequired: function (userAttributes, requiredAttributes) {
                delete userAttributes.email_verified;
                cognitoUser.completeNewPasswordChallenge(userDetails.newPassword, userAttributes, this);
            }
        });
    });
};

module.exports.updateUser = (user) => {
    let updateParams = UserPoolHelper.buildUpdateUserParameters(user);

    let cognito = new AWS.CognitoIdentityServiceProvider();
    return new Promise((resolve, reject) => {
        cognito.adminUpdateUserAttributes(updateParams, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

module.exports.signOut = (userDetails) => {
    let cognitoUser = this.getCognitoUser(userDetails);
    cognitoUser.signOut();
};

module.exports.refreshToken = (refreshToken) => {
    let params = UserPoolHelper.buildRefreshTokenParameters(refreshToken);
    let cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
    return new Promise((resolve, reject) => {
        cognitoIdentityServiceProvider.adminInitiateAuth(params, (error, data) => {
            if (error) {
                reject(error);
            } else {
                let tokens = buildRefreshTokenResponse(data.AuthenticationResult);
                resolve(tokens);
            }
        });
    });
};

module.exports.changePassword = (cognitoUser, userDetails) => {
    return new Promise((resolve, reject) => {
        initUserSession(cognitoUser, reject);

        cognitoUser.changePassword(userDetails.password, userDetails.newPassword, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports.getCognitoUser = (userDetails) => {
    let userPool = getUserPool();
    let userData = {
        Username: userDetails.email,
        Pool: userPool
    };
    return new AWSCognito.CognitoUser(userData);
};

module.exports.disableUser = (username) => {
    let cognito = new AWS.CognitoIdentityServiceProvider();
    let params = UserPoolHelper.buildUserPoolAdminActionParams(username);
    return new Promise((resolve, reject) => {
        cognito.adminDisableUser(params, (error, data) => {
            error ? reject(error) : resolve(data);
        });
    });
};

module.exports.enableUser = (username) => {
    let cognito = new AWS.CognitoIdentityServiceProvider();
    let params = UserPoolHelper.buildUserPoolAdminActionParams(username);
    return new Promise((resolve, reject) => {
        cognito.adminEnableUser(params, (error, data) => {
            error ? reject(error) : resolve(data);
        });
    });
};

module.exports.resetPassword = (email) => {
    let cognito = new AWS.CognitoIdentityServiceProvider();

    return new Promise((resolve, reject) => {
        cognito.forgotPassword(UserPoolHelper.buildResetPasswordParameters(email), (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
};

module.exports.confirmResetPassword = (username, verificationCode, password) => {
    let cognito = new AWS.CognitoIdentityServiceProvider();
    let params = UserPoolHelper.buildConfirmResetPasswordParameters(username, verificationCode, password);

    return new Promise((resolve, reject) => {
        cognito.confirmForgotPassword(params, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
};

function initUserSession(cognitoUser, rejectCallback) {
    cognitoUser.getSession((err, session) => {
        if (err) {
            rejectCallback(err);
        }
    });
}

function getAuthenticationDetails(userDetails) {
    let authenticationData = {
        Username: userDetails.email,
        Password: userDetails.password,
    };
    return new AWSCognito.AuthenticationDetails(authenticationData);
}

function getUserPool() {
    let poolData = UserPoolHelper.buildUserPoolData();
    return new AWSCognito.CognitoUserPool(poolData);
}

function buildResponseWithTokens(tokenSet) {
    let token = `Bearer ${tokenSet.idToken.jwtToken}`;
    let refreshToken = tokenSet.refreshToken.token;
    let accessToken = tokenSet.accessToken.jwtToken;
    return {
        token: token,
        refreshToken: refreshToken,
        accessToken: accessToken
    };
}

function buildRefreshTokenResponse(authenticationResult) {
    let token = `Bearer ${authenticationResult.IdToken}`;
    let accessToken = authenticationResult.AccessToken;
    return {
        token: token,
        accessToken: accessToken
    };
}