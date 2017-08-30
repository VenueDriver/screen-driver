'use strict';

const uuid = require('uuid');
const PriorityTypes = require('./../../enums/priority_types');
const ParametersBuilder = require('./../helpers/parameters_builder');
const ConflictsIdentifier = require('../helpers/conflicts_identifier');
const DbHelper = require('./../../helpers/db_helper');
const SettingUtils = require('./../helpers/setting_utils');
const ScheduleUtils = require('./../../schedule/helpers/schedule_utils');

const _ = require('lodash');
const Q = require('q');
let db;

class Setting {
    constructor(setting, database) {
        if (database) db = database;
        if (setting) {
            this.id = setting.id;
            this.name = setting.name;
            this.enabled = setting.enabled == null ? false : setting.enabled;
            this.priority = setting.priority;
            this.config = setting.config == null ? {} : setting.config;
            this.forciblyEnabled = setting.hasOwnProperty('forciblyEnabled') ? setting.forciblyEnabled : false;
            this._rev = setting._rev;
        }
    }

    create() {
        const params = {
            TableName: process.env.SETTINGS_TABLE,
            Item: this,
        };
        let deferred = Q.defer();
        this._rev = 0;
        this.generateId();
        this.validate()
            .then(() => DbHelper.putItem(params, deferred))
            .fail(errorMessage => deferred.reject(errorMessage));

        return deferred.promise;
    }

    update() {
        let deferred = Q.defer();
        let params = ParametersBuilder.buildUpdateRequestParameters(this);

        if (!this._rev) deferred.reject('Missed revision number');

        let conflicts;

        this.validate()
            .then(() => ConflictsIdentifier.findConflicts(this))
            .then(conflictedConfigs => {
                if (!_.isEmpty(conflictedConfigs)) {
                    conflicts = conflictedConfigs;
                    params.ExpressionAttributeValues[':enabled'] = false;
                }
                return DbHelper.updateItem(params);
            })
            .then(updatedSetting => {
                updatedSetting.conflicts = conflicts;
                deferred.resolve(updatedSetting);
            })
            .fail(errorMessage => deferred.reject(errorMessage));

        return deferred.promise;
    }

    deleteSetting() {
        let setting;
        return this._findSettingById()
            .then(_setting => {
                setting = _setting;
                return this._performDelete();
            })
            .then(() => {
                return ScheduleUtils.deleteSchedulesForSetting(setting.id)
            })
    }

    _findSettingById() {
        return new Promise((resolve, reject) => {
            DbHelper.findOne(process.env.SETTINGS_TABLE, this.id)
                .then(setting => resolve(setting.Item));
        });
    }

    _performDelete() {
        let deleteParams = {
            TableName: process.env.SETTINGS_TABLE,
            Key: {
                id: this.id,
            },
        };

        return new Promise((resolve, reject) => {
            db.delete(deleteParams, (error, data) => {
                if (error) {
                    reject(error.message);
                } else {
                    resolve();
                }
            })
        });
    }

    validate() {
        let deferred = Q.defer();
        if (!this.name) deferred.reject('Setting couldn\'t be without name');
        if (this.name == '') deferred.reject('Setting couldn\'t be without name');
        if (this.name && this.name.length <= 3) deferred.reject('Setting\'s name should be longer then 3 symbols');
        if (typeof(this.enabled) !== 'boolean') deferred.reject('Enabled field should be boolean');
        if (!this.isConfigValid(this.config)) deferred.reject('Enabled field should be boolean');
        if (!this.priority) deferred.reject('Config couldn\'t be without priority');
        if (typeof this.forciblyEnabled != 'boolean') deferred.reject('Forcibly enabled field should be type of boolean');

        if (!PriorityTypes.getTypes().find((type) => type.id === this.priority)) deferred.reject('Wrong priority type');
        Setting.hasUniqueName(this)
            .then(() => deferred.resolve())
            .fail((errorMessage) => deferred.reject(errorMessage));
        return deferred.promise;
    };

    //Todo To implement it
    isConfigValid(config) {
        return true;
    }

    static hasUniqueName(setting) {
        let deferred = Q.defer();
        this.getExistingNames(_getExcludedSetting())
            .then(names => {
                if (names.includes(setting.name)) {
                    deferred.reject('Setting with such name already exists')
                } else {
                    deferred.resolve();
                }
            });
        return deferred.promise;

        function _getExcludedSetting() {
            return setting._rev ? setting : null;
        }
    }

    static getExistingNames(excludedVenue) {
        let deferred = Q.defer();
        let params = {TableName: process.env.SETTINGS_TABLE};
        db.scan(params, (error, data) => {
            if (error) {
                deferred.reject(error.message);
            } else {
                let names = _extractNames(data);
                deferred.resolve(names);
            }
        });
        return deferred.promise;

        function _extractNames(data) {
            return data.Items
                .filter(item => excludedVenue ? item.id !== excludedVenue.id : true)
                .map((config) => config.name);
        }
    }

    generateId() {
        this.id = uuid.v1();
    };
}

module.exports = Setting;
