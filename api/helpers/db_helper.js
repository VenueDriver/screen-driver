'use strict';

const Q = require('q');
const dynamoDb = require('./../dynamodb');

module.exports.findAll = (tableName) => {
    let deferred = Q.defer();
    dynamoDb.scan({TableName: tableName}, (error, result) => {
        if (error) {
            deferred.reject(`Couldn\'t perform scan operation on ${tableName} table: ${error.message}`);
        }
        deferred.resolve(result ? result.Items : result);
    });
    return deferred.promise;
};
