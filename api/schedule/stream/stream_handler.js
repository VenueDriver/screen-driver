'use strict';

const FunctionInvokeHelper = require('../../helpers/function_invoke_helper');
const _ = require('lodash');

module.exports.handleEvent = (event, context) => {
    let changedSchedule = _.find(event.Records, record => {
        return shouldBeNotified(record);
    });
    if (changedSchedule) {
        triggerUpdateEvent(context);
    }
};

function shouldBeNotified(record) {
    switch (record.eventName) {
        case 'REMOVE': return isEnabledScheduleRemoved(record.dynamodb);
        case 'MODIFY': return isEnabledScheduleChanged(record.dynamodb);
        default: return true;
    }
}

function isEnabledScheduleChanged(streamInfo) {
    let oldSchedule = streamInfo.OldImage;
    let newSchedule = streamInfo.NewImage;
    return !(!newSchedule.enabled.BOOL && !oldSchedule.enabled.BOOL);
}

function isEnabledScheduleRemoved(streamInfo) {
    let removedSchedule = streamInfo.OldImage;
    return removedSchedule.enabled.BOOL;
}

function triggerUpdateEvent(context) {
    let params = buildParamsForInvokeFunction(context);
    FunctionInvokeHelper.invokeFunction(params, context);
}

function buildParamsForInvokeFunction(context) {
    let functionName = context.functionName;
    let functionNameSuffix = functionName.substring(0, functionName.lastIndexOf('-') + 1);
    return {
        FunctionName: `${functionNameSuffix}push_schedules_update`,
        InvocationType: 'RequestResponse'
    };
}
