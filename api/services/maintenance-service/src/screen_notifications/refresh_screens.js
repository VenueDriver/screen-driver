'use strict';


const ModulePathManager = require('../module_path_manager');
const Notifier = require(ModulePathManager.getBasePath() + 'lib/notifier/notifier');
const PusherChannels = require(ModulePathManager.getBasePath() + 'lib/notifier/pusher_channels').PusherChannels;

const ScreensChannel = PusherChannels.screens;
const ChannelEvent = ScreensChannel.events.refresh;

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
    Notifier.pushNotification(ScreensChannel.name, ChannelEvent, {screens: screens});
}
