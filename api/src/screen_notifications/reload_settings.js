'use strict';

const Notifier = require('./notifier');

module.exports.settingUpdateMessage = (event, context) => {

    Notifier.pushNotification('screens', 'setting_updated', event);

};