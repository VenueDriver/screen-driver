'use strict';

const Notifier = require('../../notifier/notifier');
const PusherChannels = require('../../notifier/pusher_chanels').PusherChannels;

const venueChannel = PusherChannels.venues.name;
const channelEvent = PusherChannels.venues.events.auto_update_schedule_updated;

module.exports.handleEvent = (event, context, callback) => {
    event.Records.forEach((record) => {
        let newImage = record.dynamodb.NewImage;
        if (isNotRemoveAction(record.eventName)) {
            Notifier.pushNotification(venueChannel, channelEvent, scheduleConfigFromImage(newImage));
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


