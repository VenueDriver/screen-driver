'use strict';
let Pusher = require('pusher');

module.exports.Pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    encrypted: true
});

module.exports.getPusherConfig = () => {
    return {
        key: process.env.PUSHER_KEY,
        cluster: process.env.PUSHER_CLUSTER
    };
};
