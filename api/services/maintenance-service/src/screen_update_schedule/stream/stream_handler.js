'use strict';

const ModulePathManager = require('../../module_path_manager');
const Notifier = require(ModulePathManager.getBasePath() + 'lib/notifier/notifier');
const PusherChannels = require(ModulePathManager.getBasePath() + 'lib/notifier/pusher_channels').PusherChannels;

const VenuesChannel = PusherChannels.venues;
const ChannelEvent = VenuesChannel.events.auto_update_schedule_updated;

module.exports.handleEvent = (event, context, callback) => {
    event.Records.forEach((record) => {
        let newImage = record.dynamodb.NewImage;
        if (isNotRemoveAction(record.eventName)) {
            Notifier.pushNotification(VenuesChannel.name, ChannelEvent, scheduleConfigFromImage(newImage));
        }
    });
};

function isNotRemoveAction(action) {
    return action.toLowerCase() !== 'remove';
}

function scheduleConfigFromImage(newImage) {
    let id = newImage.id.S;
    let enabled = newImage.enabled.BOOL;
    let eventTime = newImage.eventTime.S;

    return {id, enabled, eventTime};
}


