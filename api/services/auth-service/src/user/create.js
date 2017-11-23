'use strict';
let User = require('./entities/user');

const dynamodb = require('../dynamodb/dynamodb');
const responseHelper = require('lib/helpers/http_response_helper');


module.exports.create = (event, context, callback) => {
    const data = JSON.parse(event.body);

    let user = new User(data, dynamodb);
    user.create()
        .then(newUser => callback(null, responseHelper.createSuccessfulResponse(newUser)))
        .fail(errorMessage => callback(null, responseHelper.createResponseWithError(500, errorMessage)));
};
