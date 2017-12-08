'use strict';

const UserPoolHelper = require('./user_pool_helper');
const AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION});

class UserDetailsLoader {

    static loadUserByEmail(userEmail) {
        let cognito = new AWS.CognitoIdentityServiceProvider();
        let params = UserPoolHelper.buildSearchUserByEmailParams(userEmail);
        return new Promise((resolve, reject) => {
            cognito.listUsers(params, (error, data) => {
                return error ? reject(error) : resolve(data);
            });
        });
    }
}

module.exports = UserDetailsLoader;
