'use strict';

const ModulePathManager = require('../module_path_manager');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');
const Pusher = require('./pusher');

module.exports.getConfig = (event, context, callback) => {
    let config = Pusher.getPusherConfig();
    callback(null, responseHelper.createSuccessfulResponse(config));
};
