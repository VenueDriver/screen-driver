'use strict';

const dbHelper = require('./../helpers/db_helper');
const responseHelper = require('../helpers/http_response_helper');

module.exports.list = (event, context, callback) => {
    dbHelper.findAll(process.env.SCHEDULES_TABLE)
        .then(result => {
            callback(null, responseHelper.createSuccessfulResponse(result));
        })
        .fail(error => callback(null, responseHelper.createResponseWithError(500, error)));
};
