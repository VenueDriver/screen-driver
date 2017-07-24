'use strict';

let Pusher = require('pusher-client');
let DataLoader = require('../data_loader');

class NotificationListener {
    constructor() {

    }

    subscribe(chanel, event, callback) {
        DataLoader.loadNotificationsConfig().then(config => {
            config = JSON.parse(config);

            this.initPusher(config);

            this.subscribeToChanel(chanel);
            this.bindEvent(chanel, event, callback)
        })
    }

    initPusher(config) {
        if (this.pusher) return;
        this.pusher = new Pusher(config.key, {
            cluster: config.cluster
        });
    }

    subscribeToChanel(chanel) {
        if (this.pusher.channels.find(chanel)) {
            return;
        }
        this.pusher.subscribe(chanel);
    }

    bindEvent(channel, event, callback) {
        let existingChanel = this.pusher.channels.find(channel)
        existingChanel.bind(event, function (data) {
            callback(data.message);
        });
    }

}

module.exports = NotificationListener;
