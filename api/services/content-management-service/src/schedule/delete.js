'use strict';

const dynamodb = require('../dynamodb/dynamodb');
const ModulePathManager = require('../module_path_manager');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');
const Schedule = require('./entities/schedule');

module.exports.delete = (event, context, callback) => {
    let scheduleId = event.pathParameters.id;
    let schedule = new Schedule({id: scheduleId}, dynamodb);

    schedule.deleteSchedule()
        .then(() => callback(null, responseHelper.createSuccessfulResponse()))
        .fail(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, `Couldn\'t remove the schedule. ${errorMessage}`))
        });
};
