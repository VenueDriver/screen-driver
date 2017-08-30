'use strict';
let Schedule = require('./entities/schedule');

const dynamodb = require('../dynamodb/dynamodb');
const responseHelper = require('../helpers/http_response_helper');
const _ = require('lodash');

module.exports.update = (event, context, callback) => {
    const data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    let schedule = new Schedule(data, dynamodb);

    schedule.update()
        .then(updatedSchedule => {
            if (_.isEmpty(updatedSchedule.conflicts)) {
                callback(null, responseHelper.createSuccessfulResponse(updatedSchedule));
            } else {
                callback(null, responseHelper.createResponse(409, updatedSchedule));
            }
        })
        .fail(errorMessage => {
            console.log(errorMessage)
            callback(null, responseHelper.createResponseWithError(500, errorMessage));
        });
};
