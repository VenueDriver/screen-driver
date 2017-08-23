'use strict';

const Q = require('q');
const dynamoDb = require('./../dynamodb/dynamodb');

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
        deferred.resolve(result);
    });
    return deferred.promise;
};


module.exports.batchDelete = (tableName, items) => {
    let itemsIds = items.map(item => item.id);
    let deleteRequestsList = [];
    itemsIds.forEach(id => deleteRequestsList.push(_generateDeleteRequest(id)));
    let params = _getBatchDeleteRequestParams();
    return batchWrite(params);

    function _generateDeleteRequest(id) {
        return {
            DeleteRequest: {
                Key: {
                    'id': id
                }
            }
        };
    }

    function _getBatchDeleteRequestParams() {
        return {
            RequestItems: {
                [tableName]: deleteRequestsList
            }
        };
    }
};

function generateParams(tableName, itemId) {
    return {
        TableName: tableName,
        Key: {
            id: itemId
        }
    }
}

function batchWrite(params) {
    return new Promise((resolve, reject) => {
        dynamoDb.batchWrite(params, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        });
    });
}