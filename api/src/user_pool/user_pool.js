'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const UserPoolHelper = require('./user_pool_helper');

module.exports.createUser = (userData) => {
    let cognito = new AWS.CognitoIdentityServiceProvider();

    let userPoolParams = UserPoolHelper.buildCreateUserParameters(userData, process.env.USER_POOL_ARN);
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