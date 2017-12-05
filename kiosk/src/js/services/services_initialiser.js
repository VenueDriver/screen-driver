
class ServicesInitialiser {

    //should be called ON application initializing
    static initBaseServices() {
        require('./../logger/logger').setupLoggerProperties();
        require('./error/global_errors_handling_service');
        require('./error/network_errors_handling_service');
        require('./error/uncaught_errors_handling_service');
        require('./network/connection_status_service');
        require('./data/autoupdate_schedule_watcher');
        require('./data/server_data_watcher');
    }

    //should be called AFTER application was initialized and ready event was called
    static initBehaviourServices() {
        require('./external-event-listeners/api_events_handler_service').init();
        require('./events/renderer_events_handler');
    }
}

module.exports = ServicesInitialiser;
