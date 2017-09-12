'use strict';

const {Pusher} = require('./pusher');
const _ = require('lodash');

module.exports.pushNotification = (channel, event, data) => {
    Pusher.trigger(channel, event, {
        "message": _.isEmpty(data) ? {} : data
    });
};