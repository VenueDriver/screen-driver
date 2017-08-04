'use strict';
const responseHelper = require('./../helpers/http_response_helper');


module.exports.getConfig = (event, context, callback) => {
    let config = {key: process.env.key, cluster: process.env.cluster};
    callback(null, responseHelper.createSuccessfulResponse(config));
};
