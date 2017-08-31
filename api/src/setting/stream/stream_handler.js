'use strict';

const FunctionInvokeHelper = require('../../helpers/function_invoke_helper');
const dbHelper = require('./../../helpers/db_helper');
const PriorityTypes = require('../../enums/priority_types');
const _ = require('lodash');

module.exports.handleEvent = (event, context) => {
    let changedSetting = _.find(event.Records, record => {
        return shouldBeNotified(record);
    });
    if (changedSetting) {
        triggerUpdateEvent(context);
    }
};

function shouldBeNotified(record) {
    switch (record.eventName) {
        case 'INSERT': return false;
        case 'REMOVE': return true;
        case 'MODIFY': return isSettingChanged(record.dynamodb);
    }
}

function isSettingChanged(streamInfo) {
    let oldSetting = streamInfo.OldImage;
    let newSetting = streamInfo.NewImage;
    if (!_.isEqual(oldSetting.priority, newSetting.priority)) {
        return true;
    }
    if (!_.isEqual(oldSetting.enabled, newSetting.enabled)) {
        return true;
    }
    if (!_.isEqual(oldSetting.forciblyEnabled, newSetting.forciblyEnabled)) {
        return true;
    }
    return !areConfigsEqual(oldSetting, newSetting);
}

function areConfigsEqual(oldSetting, newSetting) {
    let oldConfigValues = _.map(oldSetting.config.M, c => c);
    let newConfigValues = _.map(newSetting.config.M, c => c);
    return _.isEqual(oldConfigValues.sort(), newConfigValues.sort());
}

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
