'use strict';

const Setting = require('./entities/setting');

const dynamodb = require('../dynamodb');
const responseHelper = require('../helpers/http_response_helper');

module.exports.update = (event, context, callback) => {
    const data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    let setting = new Setting(data, dynamodb);

    setting.update()
        .then(updatedSetting => callback(null, responseHelper.createSuccessfulResponse(updatedSetting)))
        .fail(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, errorMessage));
        });
};
