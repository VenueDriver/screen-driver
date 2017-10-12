'use strict';

const UserPool = require('../../user_pool/user_pool');
const DbHelper = require('../../helpers/db_helper');

module.exports.disableUser = (userId, issuer) => {
    return new Promise((resolve, reject) => {
        if (userId === issuer.id) {
            reject('Unable to perform operation');
        }
        DbHelper.findOne(process.env.USERS_TABLE, userId)
            .then(user => UserPool.disableUser(user.username))
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
};
