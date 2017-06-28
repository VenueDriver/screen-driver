'use strict';

const dbHelper = require('./../helpers/db_helper');
const responseHelper = require('../helpers/http_response_helper');

module.exports.list = (event, context, callback) => {
    dbHelper.findAll(process.env.CONTENT_TABLE)
        .then(content => callback(null, responseHelper.createSuccessfulResponse(content)))
        .fail(error => callback(null, responseHelper.createResponseWithError(500, error.message)));
};