'use strict';

const uuid = require('uuid');
const dbHelper = require('../../helpers/db_helper');

const Q = require('q');
const _ = require('lodash');

let db;
//General Email Regex (RFC 5322 Official Standard)
let emailValidationRegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

class User {
    constructor(user, database) {
        if (database) db = database;
        if (user) {
            this.id = user.id;
            this.email = user.email;
            this.password = user.password;
            this.isAdmin = user.isAdmin == undefined ? false : user.isAdmin;
            this._rev = user._rev;
        }
    }

    create() {
        const params = {
            TableName: process.env.USERS_TABLE,
            Item: this,
        };
        let deferred = Q.defer();
        this._rev = 0;
        this.generateId();
        this.validate(deferred.reject);
        if (deferred.promise.inspect().state === 'rejected') {
            return deferred.promise;
        }
        dbHelper.putItem(params, deferred);
        return deferred.promise;

    }

    validate(errorCallback) {
        let errorMessage;
        if (typeof(this.isAdmin) !== 'boolean') errorMessage = 'User couldn\'t be without isAdmin flag';
        if (!this._rev && this._rev !== 0) errorMessage = 'User couldn\'t be without revision number';
        if (!Number.isInteger(Number(this._rev)) && this._rev !== 0) errorMessage = 'User\'s revision should be a number';
        if (this._rev < 0) errorMessage = 'User\'s revision can\'t be < 0';
        if (!this.isEmailValid()) errorMessage = 'Invalid email';
        if (!this.isPasswordValid()) errorMessage = 'Invalid password';

        if (errorMessage) {
            errorCallback(errorMessage);
        }
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