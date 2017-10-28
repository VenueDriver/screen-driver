'use strict';

const ModulePathManager = require('../module_path_manager');
const Pusher = require(ModulePathManager.getBasePath() + 'lib/notifier/pusher');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');

module.exports.getConfig = (event, context, callback) => {
    let config = Pusher.getPusherConfig();
    callback(null, responseHelper.createSuccessfulResponse(config));
};
