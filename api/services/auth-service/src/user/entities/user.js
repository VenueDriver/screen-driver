'use strict';

const uuid = require('uuid');
const dbHelper = require('../../helpers/db_helper');
const ParametersBuilder = require('./../helpers/parameters_builder');
const UserSaver = require('../helpers/user_saver');

const Q = require('q');
const _ = require('lodash');

let db;

const UserPool = require('../../user_pool/user_pool');

//General Email Regex (RFC 5322 Official Standard)
const emailValidationRegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const tableName = process.env.USERS_TABLE;

class User {
    constructor(user, database) {
        if (database) db = database;
        if (user) {
            this.id = user.id;
            this.email = user.email;
            this.username = user.username;
            this.password = user.password;
            this.isAdmin = user.isAdmin == undefined ? false : user.isAdmin;
            this._rev = user._rev ? user._rev : 0;
        }
    }

    create() {
        delete this.password;
        let deferred = Q.defer();
        this._rev = 0;
        this.username = this.email;
        this.validate(deferred.reject);
        this.validateEmailUniqueness(deferred.reject);
        if (deferred.promise.inspect().state === 'rejected') {
            return deferred.promise;
        }
        UserPool.createUser(this)
            .then(cognitoUser => UserSaver.saveCognitoUser(cognitoUser, this))
            .then(result => deferred.resolve(result))
            .catch(error => deferred.reject(error));
        return deferred.promise;

    }

    /*
     * @param {User} user - The user, who made update action (should contain email and role)
     */
    update(user) {
        let deferred = Q.defer();
        let params = ParametersBuilder.buildUpdateRequestParameters(this);

        this.validateRoleChanges(deferred.reject, user);
        this.validate(deferred.reject);
        if (deferred.promise.inspect().state === 'rejected') {
            return deferred.promise;
        }

        UserPool.updateUser(this)
            .then(data => dbHelper.updateItem(params, deferred));

        return deferred.promise;
    }

    validateRoleChanges(reject, user) {
        if (this.email === user.email && this.isAdmin != user.isAdmin) {
            reject('You can\'t change role of yourself');
        }
    }

    validate(errorCallback) {
        let errorMessage;
        if (typeof(this.isAdmin) !== 'boolean') errorMessage = 'User couldn\'t be without isAdmin flag';
        if (!this._rev && this._rev !== 0) errorMessage = 'User couldn\'t be without revision number';
        if (!Number.isInteger(Number(this._rev)) && this._rev !== 0) errorMessage = 'User\'s revision should be a number';
        if (this._rev < 0) errorMessage = 'User\'s revision can\'t be < 0';
        if (!this.isEmailValid()) errorMessage = 'Invalid email';

        if (errorMessage) {
            errorCallback(errorMessage);
        }
    }

    validateEmailUniqueness(errorCallback) {
        dbHelper.hasUniqueName(tableName, this.email, 'email')
            .then(result => {
                if (!result) {
                    errorCallback('User with such email already exists');
                }
            })
    }

    changeEmail() {
        let deferred = Q.defer();
        let params = ParametersBuilder.buildChangeEmailRequestParameters(this);

        if (!this.isEmailValid()) {
            deferred.reject('Invalid email');
            return deferred.promise;
        }

        UserPool.updateUser(this)
            .then(data => dbHelper.updateItem(params, deferred));

        return deferred.promise;
    }

    isEmailValid() {
        return emailValidationRegExp.test(this.email)
    }

    isPasswordValid() {
        return !_.isEmpty(this.password)
            && this.password.length >= 6
            && !this.password.includes(' ');
    }

    generateId() {
        this.id = uuid.v1();
    };
}

module.exports = User;
