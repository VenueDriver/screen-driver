'use strict';

const Setting = require('./entities/setting');

const dynamodb = require('../dynamodb/dynamodb');
const responseHelper = require('../helpers/http_response_helper');

const _ = require('lodash');

module.exports.update = (event, context, callback) => {
    const data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    let setting = new Setting(data, dynamodb);

    setting.update()
        .then(updatedSetting => {
            if (_.isEmpty(updatedSetting.conflicts)) {
                callback(null, responseHelper.createSuccessfulResponse(updatedSetting));
            } else {
                callback(null, responseHelper.createResponse(409, updatedSetting));
            }
        })
        .fail(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, errorMessage));
        });
};
