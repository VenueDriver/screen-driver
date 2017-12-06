const NotificationListener = require('../../../helpers/notification_listener');

let notificationListener = new NotificationListener();

class ApiEventsListenerService {

    static onScheduleUpdated(callback) {
        return notificationListener.subscribe('screens', 'schedule_updated', callback);
    }

    static onSettingUpdated(callback) {
        return notificationListener.subscribe('screens', 'setting_updated', callback);
    }

    static onScreenReloadSignal(callback) {
        return notificationListener.subscribe('screens', 'refresh', callback)
    }

}

module.exports = ApiEventsListenerService;
