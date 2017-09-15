'use strict';

const dbHelper = require('./../helpers/db_helper');
const ModulePathManager = require('../module_path_manager');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');
const PriorityTypes = require('../enums/priority_types');

module.exports.list = (event, context, callback) => {

    dbHelper.findAll(process.env.SETTINGS_TABLE)
        .then(settings => callback(null, responseHelper.createSuccessfulResponse(generateResponseData(settings))))
        .fail(error => callback(null, responseHelper.createResponseWithError(500, error.message)));
};


function generateResponseData(settings) {
    let priorityTypes = PriorityTypes.getTypes();
    return {settings: settings, priorityTypes: priorityTypes}
}
