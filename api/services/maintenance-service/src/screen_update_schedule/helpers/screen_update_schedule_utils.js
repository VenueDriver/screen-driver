'use strict';

const ParametersBuilder = require('./parameters_builder');
const dbHelper = require('../../helpers/db_helper');

class ScreenMaintenanceUtils {
    static put(screenUpdateSchedule) {
        let params = ParametersBuilder.buildPutRequestParameters(screenUpdateSchedule);
        return dbHelper.putItem(params);
    }

}

module.exports = ScreenMaintenanceUtils;
