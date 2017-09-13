'use strict';

const dbHelper = require('./../helpers/db_helper');
const responseHelper = require('../helpers/http_response_helper');
const User = require('./entities/user');

module.exports.list = (event, context, callback) => {
    dbHelper.findAll(process.env.USERS_TABLE)
        .then(result => {
            let users = result.map(user => new User(user));
            callback(null, responseHelper.createSuccessfulResponse(users));
        })
        .fail(error => callback(null, responseHelper.createResponseWithError(500, error)));
};
