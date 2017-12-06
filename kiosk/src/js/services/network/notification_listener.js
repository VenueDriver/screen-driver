'use strict';

let Pusher = require('pusher-client');
let DataLoader = require('../../data_loader');
const CronJob = require('cron').CronJob;

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
        new Promise((resolve, reject) => _initPusher.call(this, resolve))
            .then(pusher => _handleConnectionError(pusher));

        function _initPusher(resolve) {
            let pusher = new Pusher(config.key, {
                cluster: config.cluster
            });
            this.pusher = pusher;
            resolve(pusher);
        }

        function _handleConnectionError(pusher) {
            pusher.connection.bind('error', function (err) {
                if (err.type === 'WebSocketError') {
                    _startPeriodicalReconnect(pusher);
                }
            });
        }

        function _startPeriodicalReconnect(pusher) {
            let settingsLoadJob = new CronJob('*/10 * * * * *', function () {
                pusher.connect();
                settingsLoadJob.stop()
            }, null, true, 'UTC');
            settingsLoadJob.start();
        }
    }

    subscribeToChanel(chanel) {
        if (this.pusher.channels.find(chanel)) {
            return;
        }
        this.pusher.subscribe(chanel);
    }

    bindEvent(channel, event, callback) {
        let existingChanel = this.pusher.channels.find(channel);
        existingChanel.bind(event, function (data) {
            callback(data.message);
        });
    }

}

module.exports = NotificationListener;
