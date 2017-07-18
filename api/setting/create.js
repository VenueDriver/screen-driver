'use strict';
let Config = require('./../entities/setting');

const dynamodb = require('../dynamodb');
const responseHelper = require('../helpers/http_response_helper');


module.exports.create = (event, context, callback) => {
    const data = JSON.parse(event.body);

    let config = new Config(data, dynamodb);
    config.create()
        .then(newConfig => callback(null, responseHelper.createSuccessfulResponse(newConfig)))
        .fail(errorMessage => callback(null, responseHelper.createResponseWithError(500, errorMessage)));
};
