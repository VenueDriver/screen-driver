'use strict';

module.exports.buildCreateUserParameters = (user) => {
    return {
        UserPoolId: process.env.USER_POOL_ID,
        Username: user.email,
        DesiredDeliveryMediums: ['EMAIL'],
        UserAttributes: [
            {
                Name: 'email',
                Value: user.email
            },
            {
                Name: 'custom:admin',
                Value: user.isAdmin.toString()
            }
        ]
    };
};

module.exports.buildUserPoolData = () => {
    return {
        UserPoolId: process.env.USER_POOL_ID,
        ClientId: process.env.USER_POOL_CLIENT_ID
    };
};