'use strict';
let Schedule = require('./entities/schedule');

const dynamodb = require('../dynamodb/dynamodb');
const responseHelper = require('../helpers/http_response_helper');


module.exports.create = (event, context, callback) => {
    const data = JSON.parse(event.body);

    let schedule = new Schedule(data, dynamodb);
    schedule.create()
        .then(newSchedule => callback(null, responseHelper.createSuccessfulResponse(newSchedule)))
        .fail(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, errorMessage))
        });
};
