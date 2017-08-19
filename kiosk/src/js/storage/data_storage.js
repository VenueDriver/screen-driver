'use strict';

const _ = require('lodash');

class DataStorage {

    setServerData(serverData) {
        this._serverData = _.cloneDeep(serverData);
    }

    getServerData() {
        return _.clone(this._serverData);
    }

    setSelectedSetting(selectedSetting) {
        this._selectedSetting = _.cloneDeep(selectedSetting);
    }

    getSelectedSetting() {
        return _.cloneDeep(this._selectedSetting);
    }

    setScheduledTask(scheduledTask) {
        this._scheduledTask = _.cloneDeep(scheduledTask);
    }

    getScheduledTask() {
        return _.cloneDeep(this._scheduledTask);
    }
}

const DATA_STORAGE = new DataStorage();

module.exports = DATA_STORAGE;