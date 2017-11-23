'use strict';

const dynamoDb = require('./../dynamodb/dynamodb');
const dbHelper = require('lib/helpers/db_helper');

dbHelper.setDatabase(dynamoDb);

module.exports = dbHelper;