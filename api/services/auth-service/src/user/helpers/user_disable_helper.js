'use strict';

const UserPool = require('../../user_pool/user_pool');
const DbHelper = require('../../helpers/db_helper');
const ParametersBuilder = require('./parameters_builder');

module.exports.disableUser = (userId, issuer) => {
    return new Promise((resolve, reject) => {
        if (userId === issuer.id) {
            reject('Unable to perform operation');
        }
        let userToDisable;
        let responseFromUserPool;
        DbHelper.findOne(process.env.USERS_TABLE, userId)
            .then(user => {
                userToDisable = user;
                return UserPool.disableUser(user.username);
            })
            .then(response => {
                responseFromUserPool = response;
                return updateUserStatus(userToDisable);
            })
            .then(() => resolve(responseFromUserPool))
            .catch(error => reject(error));
    });
};

function updateUserStatus(user) {
    user.enabled = false;
    let params = ParametersBuilder.buildUpdateUserStatusRequestParameters(user);
    return DbHelper.updateItem(params);
}
