'use strict';

let Config = require('./../entities/config');

const dynamodb = require('../dynamodb');
const responseHelper = require('../helpers/http_response_helper');

module.exports.update = (event, context, callback) => {
    const data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    let config = new Config(data, dynamodb);

    config.update()
        .then(updatedConfig => callback(null, responseHelper.createSuccessfulResponse(updatedConfig)))
        .fail(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, errorMessage));
        });
};
