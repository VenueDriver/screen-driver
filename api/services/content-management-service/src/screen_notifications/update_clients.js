'use strict';

const Notifier = require('../notifier/notifier');

const ModulePathManager = require('../module_path_manager');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');

module.exports.update = (event, context, callback) => {
    const data = JSON.parse(event.body);

    try {
        notifyAboutNewVersion(data.screens);
    } catch (error) {
        callback(null, responseHelper.createResponseWithError(500, error.message));
        return;
    }

    console.log(data);

    callback(null, responseHelper.createSuccessfulResponse(data));
};

function notifyAboutNewVersion(screens) {
    Notifier.pushNotification('screens', 'update', {screens: screens});
}
