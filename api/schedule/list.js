'use strict';

const dbHelper = require('./../helpers/db_helper');
const responseHelper = require('../helpers/http_response_helper');
const Schedule = require('./../entities/schedule');

module.exports.list = (event, context, callback) => {
    dbHelper.findAll(process.env.SCHEDULES_TABLE)
        .then(result => {
            let schedules = result.map(schedule => new Schedule(schedule));
            callback(null, responseHelper.createSuccessfulResponse(schedules));
        })
        .fail(error => callback(null, responseHelper.createResponseWithError(500, error)));
};
