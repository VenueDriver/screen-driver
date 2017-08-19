'use strict';

const uuid = require('uuid');
const PriorityTypes = require('./../../enums/priority_types');
const ParametersBuilder = require('./../helpers/parameters_builder');
const DbHelper = require('../../helpers/db_helper');

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
            .then(() => Setting.hasUniqueName(this))
            .then(() => Setting.hasConflictsInConfig(this))
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

    validate() {
        let deferred = Q.defer();
        if (!this.name) deferred.reject('Setting couldn\'t be without name');
        if (this.name == '') deferred.reject('Setting couldn\'t be without name');
        if (this.name && this.name.length <= 3) deferred.reject('Setting\'s name should be longer then 3 symbols');
        if (typeof(this.enabled) !== 'boolean') deferred.reject('Enabled field should be boolean');
        if (!this.isConfigValid(this.config)) deferred.reject('Enabled field should be boolean');
        if (!this.priority) deferred.reject('Config couldn\'t be without priority');

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

    static hasConflictsInConfig(setting) {
        let deferred = Q.defer();
        Setting.getExistingConfigs(setting.priority, setting.id)
            .then(configs => {
                let currentConfig = _.assignIn(...configs, {});
                let conflictedConfigs = _.pickBy(setting.config, (v, k) => currentConfig[k] !== v);
                if (!_.isEmpty(conflictedConfigs)) {
                    setting.enabled = false;
                }
                deferred.resolve(conflictedConfigs);
            });
        return deferred.promise;
    }

    static hasUniqueName(setting) {
        let deferred = Q.defer();
        this.getExistingNames(_getExcludedConfig())
            .then(names => {
                if (names.includes(setting.name)) {
                    deferred.reject('Setting with such name already exists')
                } else {
                    deferred.resolve();
                }
            });
        return deferred.promise;

        function _getExcludedConfig() {
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

    static getExistingConfigs(priorityType, settingId) {
        let deferred = Q.defer();
        let params = {TableName: process.env.SETTINGS_TABLE};
        db.scan(params, (error, data) => {
            if (error) {
                deferred.reject(error.message);
            } else {
                deferred.resolve(data.Items.filter(i => i.priority === priorityType && i.id !== settingId).map(i => i.config));
            }
        });
        return deferred.promise;

    }

    generateId() {
        this.id = uuid.v1();
    };
}

module.exports = Setting;
