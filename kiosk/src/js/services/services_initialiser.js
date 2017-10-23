
class ServicesInitialiser {
    static init() {
        require('./data/autoupdate_schedule_watcher');
        require('./data/server_data_watcher');
        require('./error/global_errors_handling_service');
        require('./error/network_errors_handling_service');
        require('./error/uncaught_errors_handling_service');
        require('./network/connection_status_service');
    }
}

module.exports = ServicesInitialiser;
