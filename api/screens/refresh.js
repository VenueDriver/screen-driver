'use strict';
let pusher = require('../entities/pusher');

const responseHelper = require('./../helpers/http_response_helper');


module.exports.refresh = (event, context, callback) => {
    const data = JSON.parse(event.body);

    try {
        sendRefreshSignal(data.screens);
    } catch (error) {
        callback(null, responseHelper.createResponseWithError(500, error.message));
        return;
    }

    callback(null, responseHelper.createSuccessfulResponse(data));
};

function sendRefreshSignal(screens) {
    pusher.trigger('screens', 'refresh', {
        "message": {screens: screens}
    });
}