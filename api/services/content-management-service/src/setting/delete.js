'use strict';

const dynamodb = require('../dynamodb/dynamodb');
const ModulePathManager = require('../module_path_manager');
const responseHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/http_response_helper');
const Setting = require('./entities/setting');

module.exports.delete = (event, context, callback) => {
    let settingId = event.pathParameters.id;
    let setting = new Setting({id: settingId}, dynamodb);

    setting.deleteSetting()
        .then(() => callback(null, responseHelper.createSuccessfulResponse()))
        .catch(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, `Couldn\'t remove the setting. ${errorMessage}`))
        });
};