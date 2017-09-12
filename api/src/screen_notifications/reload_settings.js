'use strict';

const Notifier = require('../notifier/notifier');

module.exports.settingUpdateMessage = (event) => {

    try {
        Notifier.pushNotification('screens', 'setting_updated', event);
    } catch (error) {
        console.error(error);
    }

};