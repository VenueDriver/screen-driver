'use strict';

const PriorityTypes = require('../../src/enums/priority_types');

module.exports = class SettingDataPreparationHelper {

    static getPersistentSettingWithConfig(name) {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        return SettingDataPreparationHelper.getPersistentSetting(name, config);
    }

    static getPersistentSetting(name, config) {
        return {name: name, enabled: true, priority: PriorityTypes.getTypeIds()[0], config: config, _rev: 0};
    }
};