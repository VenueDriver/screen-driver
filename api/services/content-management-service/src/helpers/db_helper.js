'use strict';

const ModulePathManager = require('../module_path_manager');
const dynamoDb = require('./../dynamodb/dynamodb');
const dbHelper = require(ModulePathManager.getBasePath() + 'lib/helpers/db_helper');

dbHelper.setDatabase(dynamoDb);

module.exports = dbHelper;