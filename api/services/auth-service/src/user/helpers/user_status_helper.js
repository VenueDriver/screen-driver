'use strict';

const UserPool = require('../../user_pool/user_pool');
const DbHelper = require('../../helpers/db_helper');
const ParametersBuilder = require('./parameters_builder');

class UserStatusHelper {

    constructor(userId, issuer) {
        this.user = {id: userId};
        this.issuer = issuer;
    }

    static init(userId, issuer) {
        return new UserStatusHelper(userId, issuer);
    }

    updateStatus(enabled) {
        return this.validate(enabled)
            .then(() => this.findUser())
            .then(() => enabled ? UserPool.enableUser(this.user.username) : UserPool.disableUser(this.user.username))
            .then(() => this.updateUserStatus(enabled));
    }

    validate(enabled) {
        return new Promise((resolve, reject) => {
            if (this.user.id === this.issuer.id) {
                reject('Unable to perform operation');
            }
            if (typeof enabled !== 'boolean') {
                reject('Invalid request');
            }
            resolve();
        });
    }

    findUser() {
        return new Promise((resolve, reject) => {
            DbHelper.findOne(process.env.USERS_TABLE, this.user.id)
                .then(user => {
                    this.user = user;
                    resolve(user);
                })
                .fail(error => reject(error));
        });
    }

    updateUserStatus(enabled) {
        this.user.enabled = enabled;
        let params = ParametersBuilder.buildUpdateUserStatusRequestParameters(this.user);
        return new Promise((resolve, reject) => {
            DbHelper.updateItem(params)
                .then(() => resolve())
                .fail(error => reject(error))
        });
    }
}

module.exports = UserStatusHelper;

