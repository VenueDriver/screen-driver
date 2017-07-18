'use strict';

const dbHelper = require('./../helpers/db_helper');
const responseHelper = require('../helpers/http_response_helper');

module.exports.list = (event, context, callback) => {
    dbHelper.findAll(process.env.CONFIGS_TABLE)
        .then(setting => callback(null, responseHelper.createSuccessfulResponse(setting)))
        .fail(error => callback(null, responseHelper.createResponseWithError(500, error.message)));
};
