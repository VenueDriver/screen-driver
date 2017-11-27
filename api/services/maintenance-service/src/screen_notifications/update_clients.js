'use strict';

const Notifier = require('../notifier/notifier');

const responseHelper = require('lib/helpers/http_response_helper');

module.exports.update = (event, context, callback) => {
    const data = JSON.parse(event.body);

    try {
        notifyAboutNewVersion(data.screens);
    } catch (error) {
        callback(null, responseHelper.createResponseWithError(500, error.message));
        return;
    }

    callback(null, responseHelper.createSuccessfulResponse({}));
};

function notifyAboutNewVersion(screens) {
    Notifier.pushNotification('screens', 'update', {screens: screens});
}
