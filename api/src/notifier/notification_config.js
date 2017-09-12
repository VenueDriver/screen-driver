'use strict';

const responseHelper = require('./../helpers/http_response_helper');
const Pusher = require('./pusher');

module.exports.getConfig = (event, context, callback) => {
    let config = Pusher.getPusherConfig();
    callback(null, responseHelper.createSuccessfulResponse(config));
};
