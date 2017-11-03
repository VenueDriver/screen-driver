'use strict';

module.exports.buildFindUserByEmailParameters = (email) => {
    return {
        TableName: process.env.USERS_TABLE,
        ExpressionAttributeValues: {
            ':email': email
        },
        FilterExpression: 'email = :email'
    };
};
