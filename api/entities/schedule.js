'use strict';

const uuid = require('uuid');

const Q = require('q');
let db;

class Schedule {
    constructor(schedule, database) {
        if (database) db = database;
        if (schedule) {
            this.id = schedule.id;
            this.setting_id = schedule.setting_id;
            this.cron = schedule.cron;
            this._rev = schedule._rev;
            return;
        }
    }

    create() {
        const params = {
            TableName: process.env.SCHEDULES_TABLE,
            Item: this,
        };
        let deferred = Q.defer();
        this._rev = 0;
        this.generateId();
        this.validate(deferred.reject);
        _putInDatabase();
        return deferred.promise;

        function _putInDatabase() {
            db.put(params, (error) => {
                if (error) {
                    deferred.reject('Couldn\'t create the item. ' + error.message);
                } else {
                    deferred.resolve(params.Item);
                }
            });
        }
    }

    update() {
        let deferred = Q.defer();
        let params = {
            TableName: process.env.SCHEDULES_TABLE,
            Key: {
                id: this.id,
            },
            ExpressionAttributeNames: {
                '#rev': '_rev',
            },
            ExpressionAttributeValues: {
                ':setting_id': this.setting_id,
                ':cron': this.cron,
                ':rev': this._rev,
                ':new_rev': ++this._rev,
            },
            UpdateExpression: 'SET setting_id = :setting_id, cron = :cron, #rev = :new_rev',
            ConditionExpression: "#rev = :rev",
            ReturnValues: 'ALL_NEW',
        };

        if (!this._rev) deferred.reject('Missed revision number');

        this.validate(deferred.reject);
        _updateInDatabase(params);

        return deferred.promise;

        function _updateInDatabase(updateParameters) {
            db.update(updateParameters, (error, result) => {
                if (error) {
                    deferred.reject(error.message);
                } else {
                    deferred.resolve(result.Attributes);
                }
            });
        }
    }

    /**
     * Validates schedule. Important: don't validates cron format syntax
     * @param {function} errorCallback: calls with error message attribute if validation failed
     */
    validate(errorCallback) {
        let errorMessage;
        if (!this.setting_id || this.setting_id === '') errorMessage = 'Schedule couldn\'t be without setting';
        if (!this.cron || this.cron === '') errorMessage = 'Schedule couldn\'t be without cron';
        if (!this._rev && this._rev !== 0) errorMessage = 'Schedule couldn\'t be without revision number';
        if (!Number.isInteger(Number(this._rev)) && this._rev !== 0) errorMessage = 'Schedule\'s revision should be a number';
        if (this._rev < 0) errorMessage = 'Schedule\'s revision can\'t be < 0';

        if (errorMessage) {
            errorCallback(errorMessage);
        }
    };

    generateId() {
        this.id = uuid.v1();
    };
}

module.exports = Schedule;
