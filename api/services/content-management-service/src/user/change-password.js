'use strict';

const responseHelper = require('../helpers/http_response_helper');
const UserPool = require('../user_pool/user_pool');

module.exports.changePassword = (event, context, callback) => {
    const data = JSON.parse(event.body);

    UserPool.changePassword(data)
        .then(() => callback(null, responseHelper.createSuccessfulResponse()))
        .catch(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, errorMessage))
        });
};
