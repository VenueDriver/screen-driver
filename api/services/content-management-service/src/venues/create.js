'use strict';

let Venue = require('./entities/venue');

const dynamodb = require('../dynamodb/dynamodb');
const responseHelper = require('lib/helpers/http_response_helper');


module.exports.create = (event, context, callback) => {
    const data = JSON.parse(event.body);

    let venue = new Venue(data, dynamodb);
    venue.create()
        .then(newVenue => callback(null, responseHelper.createSuccessfulResponse(newVenue)))
        .fail(errorMessage => callback(null, responseHelper.createResponseWithError(500, errorMessage)));
};

