'use strict';

const Q = require('q');

const database = require('../../src/dynamodb/dynamodb');

module.exports = class TestDataSever {

    static saveDefaultSetting() {
        let setting = TestDataSever._generateDefaultSetting();
        let params = TestDataSever._buildPutParameters(process.env.SETTINGS_TABLE, setting);
        let deferred = Q.defer();
        TestDataSever._performPupOperation(params, deferred);
        return deferred.promise;
    }

    static _buildPutParameters(tableName, item) {
        return {
            TableName: tableName,
            Item: item,
        };
    }

    static _generateDefaultSetting() {
        return {
            id: 'setting_id',
            name: 'Setting'
        }
    }

    static _performPupOperation(params, deferred) {
        database.put(params, (error) => {
            if (error) {
                deferred.reject(error.message);
            } else {
                deferred.resolve(params.Item);
            }
        });
    }
};

