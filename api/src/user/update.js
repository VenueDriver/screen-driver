'use strict';
let User = require('./entities/user');

const dynamodb = require('../dynamodb/dynamodb');
const responseHelper = require('../helpers/http_response_helper');
const _ = require('lodash');

module.exports.update = (event, context, callback) => {
    const data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    let user = new User(data, dynamodb);

    user.update()
        .then(updatedUser => {
            callback(null, responseHelper.createSuccessfulResponse(updatedUser));
        })
        .fail(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, errorMessage));
        });
};
