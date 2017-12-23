'use strict';

module.exports.buildUpdateRequestParameters = (user) => {
    return {
        TableName: process.env.USERS_TABLE,
        Key: {
            id: user.id,
        },
        ExpressionAttributeNames: {
            '#rev': '_rev',
        },
        ExpressionAttributeValues: {
            ':isAdmin': user.isAdmin,
            ':rev': user._rev,
            ':new_rev': increaseRevision(user),
        },
        UpdateExpression: `SET 
                isAdmin = :isAdmin, 
                #rev = :new_rev
            `,
        ConditionExpression: "#rev = :rev",
        ReturnValues: 'ALL_NEW',
    };

};

module.exports.buildCreateRequestParameters = (user) => {
    return {
        TableName: process.env.USERS_TABLE,
        Item: {
            id: user.id,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
            enabled: user.enabled,
            _rev: 0
        },
    }
};

module.exports.buildDeleteRequestParameters = (user) => {
    return {
        TableName: process.env.USERS_TABLE,
        Key: {
            id: user.id,
        }
    }
};

module.exports.buildChangeEmailRequestParameters = (user) => {
    return buildUpdateSinglePropertyRequestParameters('email', user);
};

module.exports.buildUpdateUserStatusRequestParameters = (user) => {
    return buildUpdateSinglePropertyRequestParameters('enabled', user);
};

function buildUpdateSinglePropertyRequestParameters(propertyName, user) {
    return {
        TableName: process.env.USERS_TABLE,
        Key: {
            id: user.id,
        },
        ExpressionAttributeValues: {
            ':value': user[propertyName],
        },
        UpdateExpression: `SET ${propertyName} = :value`,
        ReturnValues: 'ALL_NEW',
    };
}

function increaseRevision(user) {
    return ++user._rev;
}
