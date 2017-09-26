'use strict';

const ModulePathManager = require('../module_path_manager');
const dbHelper = require('./../helpers/db_helper');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');

module.exports.list = (event, context, callback) => {
    dbHelper.findAll(process.env.CONTENT_TABLE)
        .then(content => callback(null, responseHelper.createSuccessfulResponse(content)))
        .fail(error => callback(null, responseHelper.createResponseWithError(500, error.message)));
};