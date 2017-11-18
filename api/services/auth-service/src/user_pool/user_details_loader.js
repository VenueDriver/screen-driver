'use strict';

const UserPoolHelper = require('./user_pool_helper');
const AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION});

class UserDetailsLoader {

    static loadUserByUsername(username) {
        let cognito = new AWS.CognitoIdentityServiceProvider();
        let params = UserPoolHelper.buildUserPoolAdminActionParams(username);
        return new Promise((resolve, reject) => {
            cognito.adminGetUser(params, (error, data) => {
               return error ? reject(error) : resolve(data);
            });
        });
    }

    static loadUserByEmail(userEmail) {
        let cognito = new AWS.CognitoIdentityServiceProvider();
        let params = UserPoolHelper.buildSearchUserByEmailParams(userEmail);
        console.log('load user params', params)
        return new Promise((resolve, reject) => {
            cognito.listUsers(params, (error, data) => {
                return error ? reject(error) : resolve(data);
            });
        });
    }
}

module.exports = UserDetailsLoader;
