'use strict';

let pusher = require('./pusher');

module.exports.pushNotification = (channel, event, data) => {
    pusher.trigger(channel, event, {
        "message": data
    })
};