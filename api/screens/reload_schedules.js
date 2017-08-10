'use strict';

const pusher = require('../notifier/pusher');

module.exports.scheduleUpdateMessage = (event, context) => {

    pusher.trigger('screens', 'schedule_update', {
        "message": event
    });

};
