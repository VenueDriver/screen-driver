'use strict';

const aws = require('aws-sdk');
const lambda = new aws.Lambda();

module.exports.invokeFunction = (params, context) => {

    lambda.invoke(params, (err, data) => {
    })

};