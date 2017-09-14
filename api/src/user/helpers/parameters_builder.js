'use strict';

module.exports.buildUpdateRequestParameters = (user) => {
    let params = {
        TableName: process.env.USERS_TABLE,
        Key: {
            id: user.id,
        },
        ExpressionAttributeNames: {
            '#rev': '_rev',
        },
        ExpressionAttributeValues: {
            ':email': user.email,
            ':password': user.password,
            ':isAdmin': user.isAdmin,
            ':rev': user._rev,
            ':new_rev': increaseRevision(user),
        },
        UpdateExpression: `SET 
                ${_getPasswordUpdateExpression()} 
                isAdmin = :isAdmin, 
                email = :email, 
                #rev = :new_rev
            `,
        ConditionExpression: "#rev = :rev",
        ReturnValues: 'ALL_NEW',
    };

    if (user.password) {
        params.ExpressionAttributeValues[':password'] = user.password;

    }

    return params;

    function _getPasswordUpdateExpression() {
        return user.password ? 'password = :password,' : '';
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

function increaseRevision(user) {
    return ++user._rev;
}
