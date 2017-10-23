'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

let options = {};

// connect to local DB if running offline
if (process.env.IS_OFFLINE || process.env.STAGE == 'test') {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8002',
  };
}

const client = new AWS.DynamoDB.DocumentClient(options);

module.exports = client;