'use strict';

const pusher = require('../entities/pusher');

module.exports.scheduleUpdateMessage = (event, context) => {

    pusher.trigger('screens', 'schedule_update', {
        "message": event
    });

};
