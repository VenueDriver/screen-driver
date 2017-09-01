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
            ':password': user.password,
            ':isAdmin': user.isAdmin,
            ':rev': user._rev,
            ':new_rev': increaseRevision(user),
        },
        UpdateExpression: `SET 
                password = :password, 
                isAdmin = :isAdmin, 
                #rev = :new_rev
            `,
        ConditionExpression: "#rev = :rev",
        ReturnValues: 'ALL_NEW',
    }
};

module.exports.buildCreateRequestParameters = (user) => {
    return {
        TableName: process.env.USERS_TABLE,
        Item: user,
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

function increaseRevision(setting) {
    return ++setting._rev;
}
