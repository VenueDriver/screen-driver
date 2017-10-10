'use strict';

const DbHelper = require('../helpers/db_helper');
const UserPool = require('../user_pool/user_pool');

module.exports.authenticate = (userDetails) => {
    return loadUser(userDetails);
};

function loadUser(userDetails) {
    let params = buildFindUserByEmailParams(userDetails.email);
    return DbHelper.findByParams(params).then(users => {
        userDetails.username = users[0].username;
        return UserPool.authenticate(userDetails);
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