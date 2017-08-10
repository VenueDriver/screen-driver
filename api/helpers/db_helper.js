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

module.exports.findOne = (tableName, itemId) => {
    let deferred = Q.defer();
    let params = generateParams(tableName, itemId);
    dynamoDb.get(params, (error, result) => {
        if (error) {
            deferred.reject(`Couldn\'t perform scan operation on ${tableName} table: ${error.message}`);
        }
        console.log('venue', result);
        deferred.resolve(result);
    });
    return deferred.promise;
};

function generateParams(tableName, itemId) {
    return {
        TableName: tableName,
        Key: {
            id: itemId
        }
    }
}
