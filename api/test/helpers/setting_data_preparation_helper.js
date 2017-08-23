'use strict';

const PriorityTypes = require('../../src/enums/priority_types');
const uuid = require('uuid');

module.exports = class SettingDataPreparationHelper {

    static getPersistentSettingWithConfig(name) {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        return SettingDataPreparationHelper.getPersistentSetting(name, config);
    }

    static getPersistentSetting(name, config) {
        return {
            id: uuid.v1(),
            name: name,
            enabled: true,
            priority: PriorityTypes.getTypeIds()[0],
            config: config,
            _rev: 0
        };
    }

    static getPeriodicalSetting(name, config) {
        return {
            id: uuid.v1(),
            name: name,
            enabled: true,
            priority: PriorityTypes.getTypeIds()[1],
            config: config,
            _rev: 0
        };
    }

    static getOccasionalSetting(name, config) {
        return {
            id: uuid.v1(),
            name: name,
            enabled: true,
            priority: PriorityTypes.getTypeIds()[2],
            config: config,
            _rev: 0
        };
    }
};