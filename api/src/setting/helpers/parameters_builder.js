'use strict';

module.exports.buildUpdateRequestParameters = (setting) => {
    return {
        TableName: process.env.SETTINGS_TABLE,
        Key: {
            id: setting.id,
        },
        ExpressionAttributeNames: {
            '#setting_name': 'name',
            '#rev': '_rev',
        },
        ExpressionAttributeValues: {
            ':name': setting.name,
            ':enabled': setting.enabled,
            ':priority': setting.priority,
            ':config': setting.config,
            ':rev': setting._rev,
            ':new_rev': increaseRevision(setting),
        },
        UpdateExpression:
            `SET 
                #setting_name = :name, 
                enabled = :enabled, 
                priority = :priority, 
                config = :config, 
                #rev = :new_rev
            `,
        ConditionExpression: "#rev = :rev",
        ReturnValues: 'ALL_NEW',
    };
};

module.exports.buildUpdateConfigParameters = (setting) => {
    return {
        TableName: process.env.SETTINGS_TABLE,
        Key: {
            id: setting.id,
        },
        ExpressionAttributeNames: {
            '#rev': '_rev',
        },
        ExpressionAttributeValues: {
            ':config': setting.config,
            ':rev': setting._rev,
            ':new_rev': increaseRevision(setting),
        },
        UpdateExpression: 'SET config = :config, #rev = :new_rev',
        ConditionExpression: "#rev = :rev",
        ReturnValues: 'ALL_NEW',
    };
};

function increaseRevision(setting) {
    return ++setting._rev;
}