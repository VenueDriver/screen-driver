'use strict';

let Pusher = require('pusher-client');
let DataLoader = require('../data_loader');

class NotificationListener {
    constructor() {
        DataLoader.loadNotificationsConfig().then(config => {
            this.pusher =  new Pusher(config.key, {
                cluster: config.cluster
            });
        })
    }

    subscribe(chanel, event, callback) {
        let channel = this.pusher.subscribe(chanel);
        channel.bind(event, function(data) {
            callback(data.message);
        });
    }

}

module.exports = NotificationListener;
