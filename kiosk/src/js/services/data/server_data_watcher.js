const Subject = require('rxjs').Subject;

let serverDataUpdated = new Subject();

class ServerDataWatcher {

    static update(serverData) {
        serverDataUpdated.next(serverData);
    }

    static getWatcher() {
        return serverDataUpdated.asObservable();
    }

}

module.exports = ServerDataWatcher;
