'use strict';

const pusher = require('../entities/pusher');
const aws = require('aws-sdk');
const lambda = new aws.Lambda();

module.exports.event = (event, context) => {
    let functionName = context.functionName;
    let functionNameSuffix = functionName.substring(0, functionName.lastIndexOf('-') + 1);
    let params = {
        FunctionName: `${functionNameSuffix}push_schedule_update_message`,
        InvocationType: 'RequestResponse'
    };

    lambda.invoke(params, function(err, data) {
        if (err) {
            context.fail(err);
        } else {
            context.succeed('push_schedule_update_message');
        }
    })
};
