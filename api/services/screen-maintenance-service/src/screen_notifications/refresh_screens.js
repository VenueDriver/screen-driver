'use strict';

const Notifier = require('../notifier/notifier');

const ModulePathManager = require('../module_path_manager');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');


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
    Notifier.pushNotification('screens', 'refresh', {screens: screens});
}
