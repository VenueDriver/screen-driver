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
            this.startDate = schedule.startDate;
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
        if (isNaN(Date.parse(this.startDate))) errorMessage = ('Wrong data format');
        if (!this.startDate || this.startDate === '') errorMessage = ('Schedule couldn\'t be without start date');

        if (errorMessage) {
            errorCallback(errorMessage);
        }
    };

    generateId() {
        this.id = uuid.v1();
    };

    increaseRevision() {
        this._rev++;
    };
}

module.exports = Schedule;
