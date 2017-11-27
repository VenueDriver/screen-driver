'use strict';

const dbHelper = require('../helpers/db_helper');
const ScreenUpdateSchedule = require('./entities/screen_update_schedule');

const responseHelper = require('lib/helpers/http_response_helper');

module.exports.getAll = (event, context, callback) => {

    dbHelper.findAll(process.env.SCREENS_UPDATE_SCHEDULES_TABLE)
        .then(result => {
            let schedules = result.map(schedule => new ScreenUpdateSchedule(schedule));
            callback(null, responseHelper.createSuccessfulResponse(schedules));
        })
        .fail(error => {
            callback(null, responseHelper.createResponseWithError(500, error))
        });
};

module.exports.put = (event, context, callback) => {
    const data = JSON.parse(event.body);
    let screenUpdateSchedule = new ScreenUpdateSchedule(data);

    screenUpdateSchedule.put()
        .then(result => {
            callback(null, responseHelper.createSuccessfulResponse(result));
        })
        .fail(error => {
            callback(null, responseHelper.createResponseWithError(500, error))
        });
};
