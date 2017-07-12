'use strict';

const uuid = require('uuid');

const Q = require('q');
let db;

class Config {
    constructor(config, database) {
        if (database) db = database;
        if (config) {
            this.id = config.id;
            this.name = config.name;
            this.enabled = config.enabled == null ? false : config.enabled;
            this.config = config.config == null ? {} : config.config;
            this._rev = config._rev;
        }
    }

    create() {
        const params = {
            TableName: process.env.CONFIGS_TABLE,
            Item: this,
        };
        let deferred = Q.defer();
        this._rev = 0;
        this.generateId();
        this.validate()
            .then(_putInDatabase)
            .fail(errorMessage => deferred.reject(errorMessage));

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

    validate() {
        let deferred = Q.defer();
        if (!this.name) deferred.reject('Config couldn\'t be without name');
        if (this.name == '') deferred.reject('Config couldn\'t be without name');
        if (this.name && this.name.length < 3) deferred.reject('Config\'s name should be longer then 3 symbols');
        if (typeof(this.enabled) !== 'boolean') deferred.reject('Enabled field should be boolean');
        if (!this.isConfigValid(this.config)) deferred.reject('Enabled field should be boolean');
        Config.hasUniqueName(this)
            .then(() => deferred.resolve())
            .fail((errorMessage) => deferred.reject(errorMessage));

        return deferred.promise;
    };

    //Todo To implement it
    isConfigValid(config) {
        return true;
    }

    static hasUniqueName(config) {
        let deferred = Q.defer();
        this.getExistingNames(_getExcludedConfig())
            .then(names => {
                if (names.includes(config.name)) {
                    deferred.reject('Config with such name already exists')
                } else {
                    deferred.resolve();
                }
            });
        return deferred.promise;

        function _getExcludedConfig() {
            return config._rev ? config : null;
        }
    }

    static getExistingNames(excludedVenue) {
        let deferred = Q.defer();
        let params = {TableName: process.env.CONFIGS_TABLE};
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

    increaseRevision() {
        this._rev++;
    };
}

module.exports = Config;
