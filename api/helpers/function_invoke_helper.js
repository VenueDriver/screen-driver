'use strict';

const aws = require('aws-sdk');
const lambda = new aws.Lambda();

module.exports.invokeFunction = (params, context) => {
    lambda.invoke(params, function(err, data) {
        if (err) {
            context.fail(err);
        } else {
            context.succeed(data);
        }
    })
};