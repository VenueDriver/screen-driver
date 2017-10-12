'use strict';

const UserPoolHelper = require('./user_pool_helper');
const AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION});

class UserDetailsLoader {

    static loadUserByUsername(username) {
        let cognito = new AWS.CognitoIdentityServiceProvider();
        let params = UserPoolHelper.buildAdminGetUserParams(username);
        return new Promise((resolve, reject) => {
            cognito.adminGetUser(params, (error, data) => {
               return error ? reject(error) : resolve(data);
            });
        });
    }
}

module.exports = UserDetailsLoader;
