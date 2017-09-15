'use strict';

const dbHelper = require('./../helpers/db_helper');
const ModulePathManager = require('../module_path_manager');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');
const Schedule = require('./entities/schedule');

module.exports.list = (event, context, callback) => {
    dbHelper.findAll(process.env.SCHEDULES_TABLE)
        .then(result => {
            let schedules = result.map(schedule => new Schedule(schedule));
            callback(null, responseHelper.createSuccessfulResponse(schedules));
        })
        .fail(error => callback(null, responseHelper.createResponseWithError(500, error)));
};
