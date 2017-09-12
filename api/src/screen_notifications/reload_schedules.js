'use strict';

const Notifier = require('../notifier/notifier');

module.exports.scheduleUpdateMessage = () => {

    try {
        Notifier.pushNotification('screens', 'schedule_update');
    } catch (error) {
        console.error(error);
    }

};
