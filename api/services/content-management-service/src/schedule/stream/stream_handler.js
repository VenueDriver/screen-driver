'use strict';

const Notifier = require('../../notifier/notifier');
const _ = require('lodash');

module.exports.handleEvent = (event, context) => {
    let changedSchedule = _.find(event.Records, record => {
        return shouldBeNotified(record);
    });
    if (changedSchedule) {
        triggerUpdateEvent();
    }
};

function shouldBeNotified(record) {
    switch (record.eventName) {
        case 'REMOVE': return isEnabledScheduleRemoved(record.dynamodb);
        case 'MODIFY': return isEnabledScheduleChanged(record.dynamodb);
        default: return true;
    }
}

function isEnabledScheduleChanged(streamInfo) {
    let oldSchedule = streamInfo.OldImage;
    let newSchedule = streamInfo.NewImage;
    return !(!newSchedule.enabled.BOOL && !oldSchedule.enabled.BOOL);
}

function isEnabledScheduleRemoved(streamInfo) {
    let removedSchedule = streamInfo.OldImage;
    return removedSchedule.enabled.BOOL;
}

function triggerUpdateEvent() {
    Notifier.pushNotification('screens', 'schedule_updated');
}
