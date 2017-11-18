'use strict';

const UserPool = require('../user_pool/user_pool');
const ResponseHelper = require('lib/helpers/http_response_helper');

module.exports.refresh = (event, context, callback) => {
    const data = JSON.parse(event.body);

    UserPool.refreshToken(data.refreshToken)
        .then(tokens => callback(null, ResponseHelper.createSuccessfulResponse(tokens)))
        .catch(errorMessage => callback(null, ResponseHelper.createResponseWithError(401, errorMessage)));
};