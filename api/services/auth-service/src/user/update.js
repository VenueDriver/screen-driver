'use strict';

const User = require('./entities/user');
const TokenParser = require('lib/auth_token/auth_token_parser');

const dynamodb = require('../dynamodb/dynamodb');
const responseHelper = require('lib/helpers/http_response_helper');

module.exports.update = (event, context, callback) => {
    let currentUserDetails = TokenParser.getCurrentUserDetails(event);

    const data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    let user = new User(data, dynamodb);

    user.update(currentUserDetails)
        .then(updatedUser => {
            callback(null, responseHelper.createSuccessfulResponse(updatedUser));
        })
        .fail(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, errorMessage));
        });
};
