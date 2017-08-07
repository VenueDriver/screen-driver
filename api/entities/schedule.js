'use strict';

const uuid = require('uuid');
const Q = require('q');

const periodicity = require('../enums/periodicity');

let db;

class Schedule {
    constructor(schedule, database) {
        if (database) db = database;
        if (schedule) {
            this.id = schedule.id;
            this.settingId = schedule.settingId;
            this.eventCron = schedule.eventCron;
            this.endEventCron = schedule.endEventCron;
            this.periodicity = schedule.periodicity;
            this._rev = schedule._rev;
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
                ':settingId': this.settingId,
                ':eventCron': this.eventCron,
                ':endEventCron': this.endEventCron,
                ':periodicity': this.periodicity,
                ':rev': this._rev,
                ':new_rev': ++this._rev,
            },
            UpdateExpression: 'SET settingId = :settingId, periodicity = :periodicity, eventCron = :eventCron, endEventCron = :endEventCron, #rev = :new_rev',
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
        if (!this.settingId || this.settingId === '') errorMessage = 'Schedule couldn\'t be without setting';
        if (periodicity.indexOf(this.periodicity) < 0) errorMessage = 'Invalid periodicity';
        if (!this.eventCron || this.eventCron === '') errorMessage = 'Schedule couldn\'t be without eventCron';
        if (!this.endEventCron || this.endEventCron === '') errorMessage = 'Schedule couldn\'t be without endEventCron';
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
