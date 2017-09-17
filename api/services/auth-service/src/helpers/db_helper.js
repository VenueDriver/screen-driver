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

module.exports.hasUniqueName = (tableName, name, field = 'name') => {
    let params = {TableName: tableName};

    return _getAllNames()
        .then(names => {
            return !names.includes(name);
        });

    function _getAllNames() {
        return new Promise((resolve, reject) => {
            dynamoDb.scan(params, (error, data) => {
                error ? reject(error.message) : resolve(_extractNames(data));
            })
        });
    }

    function _extractNames(data) {
        return data.Items
            .map((item) => item[field]);
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