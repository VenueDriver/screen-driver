'use strict';

let Venue = require('./../entities/venue');

const dynamodb = require('../dynamodb');
const Q = require('q');
const responseHelper = require('../helpers/http_response_helper');

const venuesTableName = process.env.VENUES_TABLE;

module.exports.update = (event, context, callback) => {
    const data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    let venue = new Venue(data, dynamodb);

    venue.update()
        .then(updatedVenue => callback(null, responseHelper.createSuccessfulResponse(updatedVenue)))
        .fail(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, errorMessage));
        });
};
