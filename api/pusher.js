'use strict';
let Pusher = require('pusher');

const responseHelper = require('./helpers/http_response_helper');


module.exports.trigger_pusher = (event, context, callback) => {
    const data = JSON.parse(event.body);

    var pusher = new Pusher({
        appId: '',
        key: '',
        secret: '',
        cluster: 'eu',
        encrypted: true
    });

    pusher.trigger('my-channel', 'my-event', {
        "message": "hello world"
    });

    callback(null, responseHelper.createSuccessfulResponse(data))
};
