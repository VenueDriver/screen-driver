const Subject = require('rxjs').Subject;
const ServerDataWatcher = require('./server_data_watcher');

let scheduleUpdated = new Subject();

ServerDataWatcher.getWatcher()
    .subscribe(serverData => AutoupdateScheduleWatcher.update(serverData.updateSchedules));

class AutoupdateScheduleWatcher {

    static update(autoupdateSchedule) {
        scheduleUpdated.next(autoupdateSchedule);
    }

    static getWatcher() {
        return scheduleUpdated.asObservable();
    }

}

module.exports = AutoupdateScheduleWatcher;
