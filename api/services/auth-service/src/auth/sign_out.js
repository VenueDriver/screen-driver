'use strict';

const ModulePathManager = require('../module_path_manager');
const UserPool = require(ModulePathManager.getBasePath() + 'lib/user_pool/user_pool');
const ResponseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');

module.exports.handler = (event, context, callback) => {
    const userDetails = JSON.parse(event.body);

    UserPool.signOut(userDetails);

    callback(null, ResponseHelper.createSuccessfulResponse({}))
};