'use strict';

const _ = require('lodash');

class Storage {

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
}

const STORAGE = new Storage();

module.exports = STORAGE;