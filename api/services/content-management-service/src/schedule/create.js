'use strict';

let Schedule = require('./entities/schedule');

const dynamodb = require('../dynamodb/dynamodb');
const ModulePathManager = require('../module_path_manager');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');

const _ = require('lodash');

module.exports.create = (event, context, callback) => {
    const data = JSON.parse(event.body);

    let schedule = new Schedule(data, dynamodb);
    schedule.create()
        .then(newSchedule => {
            if (_.isEmpty(newSchedule.conflicts)) {
                callback(null, responseHelper.createSuccessfulResponse(newSchedule));
            } else {
                callback(null, responseHelper.createResponse(409, newSchedule));
            }
        })
        .fail(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, errorMessage))
        });
};
