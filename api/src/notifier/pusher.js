'use strict';
let Pusher = require('pusher');

module.exports = new Pusher({
    appId: process.env.app_id,
    key: process.env.key,
    secret: process.env.secret,
    cluster: process.env.cluster,
    encrypted: true
});
