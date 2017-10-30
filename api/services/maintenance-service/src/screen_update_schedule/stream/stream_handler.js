'use strict';

const Notifier = require('../../notifier/notifier');
const PusherChannels = require('../../notifier/pusher_chanels').PusherChannels;

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
    let isEnabled = newImage.isEnabled.BOOL;
    let eventTime = newImage.eventTime.S;

    return {id, isEnabled, eventTime};
}


