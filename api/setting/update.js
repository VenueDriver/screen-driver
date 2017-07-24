'use strict';

const Setting = require('./../entities/setting');
const dbHelper = require('./../helpers/db_helper');
const PriorityTypes = require('../entities/priority_types');
const pusher = require('../entities/pusher');


const dynamodb = require('../dynamodb');
const responseHelper = require('../helpers/http_response_helper');

module.exports.update = (event, context, callback) => {
    const data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    let setting = new Setting(data, dynamodb);

    setting.update()
        .then(updatedSetting => callback(null, responseHelper.createSuccessfulResponse(updatedSetting)))
        .then(() => triggerUpdateEvent())
        .fail(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, errorMessage));
        });
};

function triggerUpdateEvent() {
    let priorityTypes = PriorityTypes.getTypes();
    prepareData(priorityTypes)
        .then(data => triggerPusher(data))
}

function prepareData(priorityTypes) {
    return dbHelper.findAll(process.env.SETTINGS_TABLE)
        .then(settings => {
            return dbHelper.findAll(process.env.CONTENT_TABLE)
                .then(content => {
                    return {settings: settings, content: content, priorityTypes: priorityTypes}
                })
        }).then(data => {
            return dbHelper.findAll(process.env.VENUES_TABLE)
                .then(venues => {
                    data.venues = venues;
                    return data;
                })
        });
}

function triggerPusher(data) {
    pusher.trigger('screens', 'setting_updated', {
        "message": data
    })
}
