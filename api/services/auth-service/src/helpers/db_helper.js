'use strict';

const Q = require('q');
const dynamoDb = require('./../dynamodb/dynamodb');

const _ = require('lodash');

module.exports.findByParams = (params) => {
    let deferred = Q.defer();
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            deferred.reject(error.message);
        }
        deferred.resolve(result ? result.Items : result);
    });
    return deferred.promise;
};

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
        deferred.resolve(result ? result.Item : result);
    });
    return deferred.promise;
};

module.exports.updateItem = (params, deferred) => {
    if (_.isEmpty(deferred)) {
        deferred = Q.defer();
    }
    dynamoDb.update(params, (error, result) => {
        if (error) {
            deferred.reject(error.message);
        } else {
            deferred.resolve(result.Attributes);
        }
    });
    return deferred.promise;
};

module.exports.putItem = (params, deferred) => {
    if (_.isEmpty(deferred)) {
        deferred = Q.defer();
    }
    dynamoDb.put(params, error => {
        if (error) {
            deferred.reject(error.message);
        } else {
            deferred.resolve(params.Item);
        }
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
