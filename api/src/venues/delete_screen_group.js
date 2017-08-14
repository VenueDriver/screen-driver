'use strict';

const dynamodb = require('../dynamodb');
const responseHelper = require('../helpers/http_response_helper');
const Venue = require('./entities/venue');

module.exports.delete = (event, context, callback) => {
    let venueId = event.pathParameters.id;
    let groupId = event.pathParameters.group_id;
    let venue = new Venue({id: venueId}, dynamodb);

    venue.deleteScreenGroup(groupId)
        .then(() => callback(null, responseHelper.createSuccessfulResponse()))
        .catch(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, `Couldn\'t remove the venue. ${errorMessage}`))
        });
};