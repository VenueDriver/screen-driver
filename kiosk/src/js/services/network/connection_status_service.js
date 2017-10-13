const isOnline = require('is-online');
const Subject = require('rxjs').Subject;
const BehaviorSubject = require('rxjs').BehaviorSubject;
const CronJob = require('cron').CronJob;
const Logger = require('./../../logger/logger');


let connected = new BehaviorSubject(true);

initListener();

function initListener() {
    new CronJob('*/5 * * * * *', checkConnectionStatus, null, true, 'UTC')
        .start();
}

function checkConnectionStatus() {
    isOnline().then(online => {
        if (_isStatusChanged(online)) {
            handleConnectionStatusChange(online);
        }
    });
}

function _isStatusChanged(currentStatus) {
    return currentStatus && !isConnected() || !currentStatus && isConnected();
}

function handleConnectionStatusChange(online) {
    Logger.info('Connection status changed: ' + online ? 'Connected' : 'Disconnected');
    connected.next(online);
}

function isConnected() {
    return connected.getValue();
}

exports.connected = connected;
