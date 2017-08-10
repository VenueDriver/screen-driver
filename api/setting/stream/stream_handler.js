'use strict';

const FunctionInvokeHelper = require('../../helpers/function_invoke_helper');
const dbHelper = require('./../../helpers/db_helper');
const PriorityTypes = require('../../entities/priority_types');

module.exports.handleEvent = (event, context) => {
    triggerUpdateEvent(context);
};

function triggerUpdateEvent(context) {
    let priorityTypes = PriorityTypes.getTypes();
    prepareData(priorityTypes)
        .then(data => {
            let params = buildParamsForInvokeFunction(context, data);
            FunctionInvokeHelper.invokeFunction(params, context);
        });
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

function buildParamsForInvokeFunction(context, payload) {
    let functionName = context.functionName;
    let functionNameSuffix = functionName.substring(0, functionName.lastIndexOf('-') + 1);
    return {
        FunctionName: `${functionNameSuffix}push_settings_update`,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(payload)
    };
}
