'use strict';
let Schedule = require('./entities/schedule');

const dynamodb = require('../dynamodb');
const responseHelper = require('../helpers/http_response_helper');

module.exports.update = (event, context, callback) => {
    const data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    let schedule = new Schedule(data, dynamodb);

    schedule.update()
        .then(updatedSchedule => callback(null, responseHelper.createSuccessfulResponse(updatedSchedule)))
        .fail(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, errorMessage));
        });
};
