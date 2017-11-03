'use strict';

const USER_POOL_DETAILS = {
    UserPoolId: process.env.USER_POOL_ID,
    ClientId: process.env.USER_POOL_CLIENT_ID
};

module.exports.buildCreateUserParameters = (user) => {
    return {
        UserPoolId: USER_POOL_DETAILS.UserPoolId,
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
            },
            {
                Name: 'email_verified',
                Value: 'true'
            },
        ]
    };
};

module.exports.buildUpdateUserParameters = (user) => {
    return {
        UserPoolId: USER_POOL_DETAILS.UserPoolId,
        Username: user.username,
        UserAttributes: [
            {
                Name: 'custom:admin',
                Value: user.isAdmin.toString()
            },
            {
                Name: 'email',
                Value: user.email
            },
            {
                Name: 'email_verified',
                Value: 'true'
            },
        ]
    };
};

module.exports.buildUserPoolData = () => {
    return USER_POOL_DETAILS;
};

module.exports.buildUserPoolAdminActionParams = (username) => {
    return {
        UserPoolId: USER_POOL_DETAILS.UserPoolId,
        Username: username
    };
};

module.exports.buildRefreshTokenParameters = (refreshToken) => {
    return {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
            REFRESH_TOKEN: refreshToken
        },
        UserPoolId: USER_POOL_DETAILS.UserPoolId,
        ClientId: USER_POOL_DETAILS.ClientId
    }
};

module.exports.buildResetPasswordParameters = (username) => {
    return {
        ClientId: USER_POOL_DETAILS.ClientId,
        Username: username,
    }
};

module.exports.buildConfirmResetPasswordParameters = (username, confirmationCode, password) => {
    return {
        ClientId: USER_POOL_DETAILS.ClientId,
        ConfirmationCode: confirmationCode,
        Password: password,
        Username: username,
    }
};