'use strict';

const ResponseHelper = require('lib/helpers/http_response_helper');
const authenticate = require('../user/authenticate');

module.exports.handler = (event, context, callback) => {
    const userDetails = JSON.parse(event.body);

    authenticate.authenticate(userDetails)
        .then(result => callback(null, ResponseHelper.createSuccessfulResponse(result)))
        .catch(err => {
            console.error(err);
            callback(null, ResponseHelper.createResponseWithError(401, err));
        });
};
