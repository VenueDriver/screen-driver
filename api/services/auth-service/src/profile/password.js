'use strict';

const ModulePathManager = require('../module_path_manager');

const dbHelper = require('./../helpers/db_helper');
const UserPool = require('../user_pool/user_pool');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');
const parametersBuilder = require('./helpers/parameters_builder');

module.exports.reset = (event, context, callback) => {
    const data = JSON.parse(event.body);
    let params = parametersBuilder.buildFindUserByEmailParameters(data.email);

    dbHelper.findByParams(params).then(users => {
        if (users.length === 0) throw new Error('User does not exist');
        let username = users[0].username;
        return UserPool.resetPassword(username);
    }).then(response => {
        callback(null, responseHelper.createSuccessfulResponse(response));
    }).catch(error => {
        console.log(error);
        callback(null, responseHelper.createResponseWithError(500, error.message));
    });
};

module.exports.confirmReset = (event, context, callback) => {
    const data = JSON.parse(event.body);
    let params = parametersBuilder.buildFindUserByEmailParameters(data.email);

    dbHelper.findByParams(params).then(users => {
        let username = users[0].username;
        return UserPool.confirmResetPassword(username, data.confirmationCode, data.password);
    }).then((response) => {
        callback(null, responseHelper.createSuccessfulResponse(response));
    }).catch(error => {
        console.log(error);
        callback(null, responseHelper.createResponseWithError(500, error.message));
    });
};