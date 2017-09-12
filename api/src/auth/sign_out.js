'use strict';

const UserPool = require('../user_pool/user_pool');
const ResponseHelper = require('../helpers/http_response_helper');

module.exports.handler = (event, context, callback) => {
    const userDetails = JSON.parse(event.body);

    UserPool.signOut(userDetails);

    callback(null, ResponseHelper.createSuccessfulResponse({}))
};