
class ServicesInitialiser {

    //should be called ON application initializing
    static initBaseServices() {
        require('./logger/logger').setupLoggerProperties();
        require('./errors/global_errors_handling_service');
        require('./errors/network_errors_handling_service');
        require('./errors/uncaught_errors_handling_service');
        require('./network/connection_status_service');
        require('./data/autoupdate_schedule_watcher');
        require('./data/server_data_watcher');
    }

    //should be called AFTER application was initialized and ready event was called
    static initBehaviourServices() {
        require('./events/external-event-listeners/api_events_handler_service').init();
        require('./events/internal-events-listeners/renderer_events_handler');
        require('./events/internal-events-listeners/hotkeys_events_handler');
    }
}

module.exports = ServicesInitialiser;
