'use strict';

const uuid = require('uuid');
const Q = require('q');
const _ = require('lodash');

const SettingFinder = require('../../setting/helpers/setting_finder');
const ScheduleUtils = require('../helpers/schedule_utils');
const ParametersBuilder = require('../helpers/parameters_builder');
const CronValidator = require('../helpers/cron-validator');
const periodicity = require('../../enums/periodicity');

const dbHelper = require('../../helpers/db_helper');

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
            this.enabled = schedule.enabled == undefined ? true : schedule.enabled;
            this._rev = schedule._rev;
        }
    }

    create() {
        let deferred = Q.defer();
        this._rev = 0;
        this.generateId();
        this.validate(deferred.reject);
        if (deferred.promise.inspect().state === 'rejected') {
            return deferred.promise;
        }

        let conflicts;
        ScheduleUtils.findConflicts(this)
            .then(conflictedConfigs => {
                if (!_.isEmpty(conflictedConfigs)) {
                    conflicts = conflictedConfigs;
                    this.enabled = false;
                }
                let params = ParametersBuilder.buildCreateRequestParameters(this);
                return dbHelper.putItem(params);
            })
            .then(newSchedule => {
                newSchedule.conflicts = conflicts;
                deferred.resolve(newSchedule);
            })
            .fail(errorMessage => deferred.reject(errorMessage));
        return deferred.promise;
    }

    update() {
        let deferred = Q.defer();
        let params = ParametersBuilder.buildUpdateRequestParameters(this);

        if (!this._rev) deferred.reject('Missed revision number');

        let conflicts;
        this.validate(deferred.reject);
        ScheduleUtils.findConflicts(this)
            .then(conflictedConfigs => {
                if (!_.isEmpty(conflictedConfigs)) {
                    conflicts = conflictedConfigs;
                    params.ExpressionAttributeValues[':enabled'] = false;
                }
                return dbHelper.updateItem(params);
            })
            .then(updatedSchedule => {
                updatedSchedule.conflicts = conflicts;
                deferred.resolve(updatedSchedule);
            })
            .fail(errorMessage => deferred.reject(errorMessage));

        return deferred.promise;
    }

    deleteSchedule() {
        let deferred = Q.defer();
        let params = ParametersBuilder.buildDeleteRequestParameters(this);
        db.delete(params, (error) => {
            if (error) {
                deferred.reject(error.message);
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    /**
     * Validates schedule.
     * @param {function} errorCallback: calls with error message attribute if validation failed
     */
    validate(errorCallback) {
        let errorMessage;
        if (_.isEmpty(this.settingId)) errorMessage = 'Schedule couldn\'t be without setting';
        if (periodicity.indexOf(this.periodicity) < 0) errorMessage = 'Invalid periodicity';
        if (!CronValidator.validate(this.eventCron, this.periodicity)) errorMessage = 'Invalid cron expression';
        if (!CronValidator.validate(this.endEventCron, this.periodicity)) errorMessage = 'Invalid cron expression';
        if (_.isEmpty(this.eventCron)) errorMessage = 'Schedule couldn\'t be without eventCron';
        if (_.isEmpty(this.endEventCron)) errorMessage = 'Schedule couldn\'t be without endEventCron';
        if (!this._rev && this._rev !== 0) errorMessage = 'Schedule couldn\'t be without revision number';
        if (!Number.isInteger(Number(this._rev)) && this._rev !== 0) errorMessage = 'Schedule\'s revision should be a number';
        if (this._rev < 0) errorMessage = 'Schedule\'s revision can\'t be < 0';

        this.findSetting()
            .then(setting => {
                if (_.isEmpty(setting)) errorMessage = 'Invalid setting';

                if (errorMessage) {
                    errorCallback(errorMessage);
                }
            });

        if (errorMessage) {
            errorCallback(errorMessage);
        }
    }

    findSetting() {
        return SettingFinder.findSettingById(this.settingId);
    }

    generateId() {
        this.id = uuid.v1();
    }
}

module.exports = Schedule;
