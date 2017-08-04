'use strict';
let Setting = require('./../entities/setting');

const dynamodb = require('../dynamodb');
const responseHelper = require('../helpers/http_response_helper');


module.exports.create = (event, context, callback) => {
    const data = JSON.parse(event.body);

    let setting = new Setting(data, dynamodb);
    setting.create()
        .then(newSetting => callback(null, responseHelper.createSuccessfulResponse(newSetting)))
        .fail(errorMessage => callback(null, responseHelper.createResponseWithError(500, errorMessage)));
};
