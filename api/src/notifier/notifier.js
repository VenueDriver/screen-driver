'use strict';

const _ = require('lodash');

let pusher = require('./pusher');

module.exports.pushNotification = (channel, event, data) => {
    pusher.trigger(channel, event, {
        "message": _.isEmpty(data) ? {} : data
    })
};