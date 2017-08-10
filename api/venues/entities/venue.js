'use strict';

const uuid = require('uuid');

const VenueUtils = require('./../helpers/venue_utils');
const ScreenGroup = require('./../../entities/screen_group');
const SettingUtils = require('./../../setting/helpers/setting_utils');
const DbHelper = require('./../../helpers/db_helper');
const ParametersBuilder = require('./../helpers/parameters_builder');
const Q = require('q');

const _ = require('lodash');

let db;

class Venue {
    constructor(venue, database) {
        if (database) db = database;
        if (venue) {
            this.id = venue.id;
            this.name = venue.name;
            this.screen_groups = this.getScreenGroups(venue);
            this._rev = venue._rev;
            return;
        }
        this.screen_groups = [];
        this._rev = 0;
    }

    getScreenGroups(venue) {
        if (!venue) venue = this;
        if (!venue.screen_groups) return [];
        let screenGroups = [];
        venue.screen_groups.forEach(group => screenGroups.push(new ScreenGroup(group)));
        return screenGroups;
    }

    create() {
        const params = {
            TableName: process.env.VENUES_TABLE,
            Item: this,
        };
        let deferred = Q.defer();
        this._rev = 0;
        this.generateId();
        this.validate()
            .then(() => this.generateIdentificatorsForGroupsAndScreens())
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

    update() {
        let deferred = Q.defer();
        let params = ParametersBuilder.buildUpdateRequestParameters(this);

        if (!this._rev) deferred.reject('Missed revision number');

        this.validate()
            .then(() => {
                this.generateIdentificatorsForGroupsAndScreens();
                return Venue.hasUniqueName(this)
            })
            .then(() => _updateInDatabase(params))
            .fail(errorMessage => deferred.reject(errorMessage));

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

    generateIdentificatorsForGroupsAndScreens() {
        this.screen_groups.forEach(group => {
            group.generateId();
            group.generateIdForScreens();
        })
    }

    validate() {
        let deferred = Q.defer();
        if (!this.name) deferred.reject('Venue couldn\'t be without name');
        if (this.name == '') deferred.reject('Venue couldn\'t be without name');
        if (!this._rev && this._rev !== 0) deferred.reject('Venue couldn\'t be without revision number');
        if (!Number.isInteger(Number(this._rev)) && this._rev !== 0) deferred.reject('Venue\'s revision should be a number');
        if (this._rev < 0) deferred.reject('Venue\'s revision can\'t be < 0');
        Venue.hasUniqueName(this)
            .then(() => this.validateScreenGroups())
            .then(() => deferred.resolve())
            .fail((errorMessage) => deferred.reject(errorMessage));
        return deferred.promise;
    };

    validateScreenGroups() {
        let deferred = Q.defer();
        if (!this.screen_groups || this.screen_groups.length == 0) {
            deferred.resolve();
            return deferred.promise;
        }

        this.screen_groups.forEach(group => {
            _validateScreenGroupsNamesUniqueness(this.screen_groups, group);
            //todo fix it
            try {
                group.validate();
            } catch (error) {
                deferred.reject(error.message);
                return;
            }
            deferred.resolve();
        });
        return deferred.promise;

        function _validateScreenGroupsNamesUniqueness(screenGroups, group) {
            let matches = 0;
            screenGroups.forEach(element => {
                if (group.name == element.name) matches++;
            });
            if (matches > 1) {
                deferred.reject('Groups should have unique names');
            }
        }
    }

    static hasUniqueName(venue) {
        let deferred = Q.defer();
        this.getExistingNames(_getExcludedVenue())
            .then(names => {
                if (names.includes(venue.name)) {
                    deferred.reject('Venue with such name already exists')
                } else {
                    deferred.resolve();
                }
            });
        return deferred.promise;

        function _getExcludedVenue() {
            return venue._rev ? venue : null;
        }
    }

    /**
     * @excludedVenue - function will return names of all venues, excluding this;
     * @return {Promise} array with names;
     */
    static getExistingNames(excludedVenue) {
        let deferred = Q.defer();
        let params = {TableName: process.env.VENUES_TABLE};
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
                .map((venue) => venue.name);
        }
    }

    generateId() {
        this.id = uuid.v1();
    };

    deleteVenue() {
        let venue;
        return this._findVenueById()
            .then(_venue => {
                venue = _venue;
                return this._performDelete();
            })
            .then(() => {
                let itemIds = VenueUtils.getAllItemIds(venue);
                return SettingUtils.updateConfigs(itemIds);
            });
    }

    deleteScreenGroup(groupId) {
        return this._findVenueById()
            .then(venue => this._performScreenGroupDelete(venue, groupId))
            .then(screenGroup => {
                let itemIds = VenueUtils.getAllGroupItemIds(screenGroup);
                return SettingUtils.updateConfigs(itemIds);
            });
    }

    _findVenueById() {
        return new Promise((resolve, reject) => {
            DbHelper.findOne(process.env.VENUES_TABLE, this.id)
                .then(venue => resolve(venue.Item));
        });
    }

    _performDelete() {
        let deleteParams = this._getDeleteRequestParameters();
        return new Promise((resolve, reject) => db.delete(deleteParams, (error, data) => {
            if (error) {
                reject(error.message);
            } else {
                resolve();
            }
        }));
    }

    _getDeleteRequestParameters() {
        return {
            TableName: process.env.VENUES_TABLE,
            Key: {
                id: this.id,
            },
        };
    }

    _performScreenGroupDelete(venue, groupId) {
        let screenGroup = _.find(venue.screen_groups, g => g.id === groupId);
        _.pull(venue.screen_groups, screenGroup);
        return new Promise((resolve, reject) => {
            let updateParameters = ParametersBuilder.buildUpdateGroupsRequestParameters(venue);
            db.update(updateParameters, (error, result) => {
                if (error) {
                    reject(error.message);
                } else {
                    resolve(screenGroup);
                }
            });
        });
    }
}

module.exports = Venue;
