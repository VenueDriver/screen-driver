'use strict';

const _ = require('lodash');

let selectedSetting = {};
let serverData = {};

function setServerData(serverData) {
    serverData = _.cloneDeep(serverData);
}

function getServerData() {
    return _.clone(serverData);
}

function setSelectedSetting(selectedSetting) {
    selectedSetting = _.cloneDeep(selectedSetting);
}

function getSelectedSetting() {
    return _.cloneDeep(selectedSetting);
}

module.exports = {
    getServerData: getServerData,
    setServerData: setServerData,
    getSelectedSetting: getSelectedSetting,
    setSelectedSetting: setSelectedSetting
};