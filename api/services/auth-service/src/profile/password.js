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
        let username = users[0].username;
        UserPool.resetPassword(username);
        callback(null, responseHelper.createSuccessfulResponse(users));
    });
};
