'use strict';

module.exports.buildCreateUserParameters = (user, userPoolArn) => {
    let userPoolSplitedArn = userPoolArn.split('/');
    let userPoolId = userPoolSplitedArn[userPoolSplitedArn.length - 1];
    return {
        UserPoolId: userPoolId,
        Username: user.email,
        DesiredDeliveryMediums: ['EMAIL'],
        UserAttributes: [
            {
                Name: 'email',
                Value: user.email
            }
        ]
    };
};