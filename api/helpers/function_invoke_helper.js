'use strict';

const aws = require('aws-sdk');
const lambda = new aws.Lambda();

module.exports.invokeFunction = (params, context, callback) => {

    lambda.invoke(params, (err, data) => {
        callback(null, err ? err : data);
    })

};