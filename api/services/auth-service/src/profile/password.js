'use strict';

const dbHelper = require('./../helpers/db_helper');
const UserPool = require('../user_pool/user_pool');
const responseHelper = require('lib/helpers/http_response_helper');
const parametersBuilder = require('./helpers/parameters_builder');

module.exports.reset = (event, context, callback) => {
    const data = JSON.parse(event.body);

    resetPassword(data.email).then(response => {
        callback(null, responseHelper.createSuccessfulResponse(response));
    }).catch(error => {
        console.error(error);
        callback(null, responseHelper.createResponseWithError(500, error.message));
    });
};

function resetPassword(email) {
    let params = parametersBuilder.buildFindUserByEmailParameters(email);

    return dbHelper.findByParams(params).then(users => {
        if (users.length === 0) throw new Error('User does not exist');
        let email = users[0].email;
        return UserPool.resetPassword(email);
    })
}

module.exports.confirmReset = (event, context, callback) => {
    const data = JSON.parse(event.body);
    dbHelper.findOne(process.env.USERS_TABLE, data.userId).then(user => {
        return UserPool.confirmResetPassword(user.username, data.verificationCode, data.password);
    }).then((response) => {
        callback(null, responseHelper.createSuccessfulResponse(response));
    }).catch(error => {
        console.error(error);
        callback(null, responseHelper.createResponseWithError(500, error.message));
    });
};
