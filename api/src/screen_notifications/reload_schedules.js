'use strict';

const Notifier = require('../notifier/notifier');

module.exports.scheduleUpdateMessage = (event, context) => {

    Notifier.pushNotification('screens', 'schedule_update');

};
