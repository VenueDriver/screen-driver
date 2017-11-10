'use strict';

const DbHelper = require('../helpers/db_helper');
const UserPool = require('../user_pool/user_pool');
const UserDetailsLoader = require('../user_pool/user_details_loader');
const UserSaver = require('../user/helpers/user_saver');

module.exports.authenticate = (userDetails) => {
    return loadUser(userDetails)
        .then(userDetails => UserPool.authenticate(userDetails))
        .catch(error => console.log(error))
};

function loadUser(userDetails) {
    let params = buildFindUserByEmailParams(userDetails.email);
    return DbHelper.findByParams(params).then(users => {
        if (users[0]) {
            userDetails.username = users[0].username;
            return new Promise((resolve, reject) => resolve(userDetails));
        }
        return syncUserProfile(userDetails);
    });
}

function syncUserProfile(userDetails) {
    return new Promise((resolve, reject) => {
        UserDetailsLoader.loadUserByEmail(userDetails.email)
            .then(cognitoUsers => UserSaver.saveExistentCognitoUser(cognitoUsers.Users[0]))
            .then(result => resolve(userDetails))
            .catch(error => reject(error));
    });
}

function buildFindUserByEmailParams(email) {
    return {
        TableName: process.env.USERS_TABLE,
        ExpressionAttributeValues: {
            ':email': email
        },
        FilterExpression: 'email = :email'
    };
}
