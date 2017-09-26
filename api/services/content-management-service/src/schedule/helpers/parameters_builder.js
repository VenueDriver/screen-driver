'use strict';

module.exports.buildUpdateRequestParameters = (schedule) => {
    return {
        TableName: process.env.SCHEDULES_TABLE,
        Key: {
            id: schedule.id,
        },
        ExpressionAttributeNames: {
            '#rev': '_rev',
        },
        ExpressionAttributeValues: {
            ':settingId': schedule.settingId,
            ':eventCron': schedule.eventCron,
            ':endEventCron': schedule.endEventCron,
            ':periodicity': schedule.periodicity,
            ':enabled': schedule.enabled,
            ':rev': schedule._rev,
            ':new_rev': ++schedule._rev,
        },
        UpdateExpression: `SET 
                settingId = :settingId, 
                periodicity = :periodicity, 
                eventCron = :eventCron, 
                endEventCron = :endEventCron, 
                enabled = :enabled, 
                #rev = :new_rev
            `,
        ConditionExpression: "#rev = :rev",
        ReturnValues: 'ALL_NEW',
    }
};

module.exports.buildCreateRequestParameters = (schedule) => {
    return {
        TableName: process.env.SCHEDULES_TABLE,
        Item: schedule,
    }
};

module.exports.buildDeleteRequestParameters = (schedule) => {
    return {
        TableName: process.env.SCHEDULES_TABLE,
        Key: {
            id: schedule.id,
        }
    }
};