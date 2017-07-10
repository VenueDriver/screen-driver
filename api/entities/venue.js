'use strict';

const uuid = require('uuid');

let ScreenGroup = require('./../entities/screen_group');
const Q = require('q');
let db;

class Venue {
    constructor(venue, database) {
        if (database) db = database;
        if (venue) {
            this.id = venue.id;
            this.name = venue.name;
            this.content_id = venue.content_id ? venue.content_id : null;
            this.screen_groups = this.getScreenGroups(venue);
            this._rev = venue._rev;
            return;
        }
        this.content_id = null;
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
        let params = {
            TableName: process.env.VENUES_TABLE,
            Key: {
                id: this.id,
            },
            ExpressionAttributeNames: {
                '#venue_name': 'name',
                '#rev': '_rev',
            },
            ExpressionAttributeValues: {
                ':name': this.name,
                ':content_id': this.content_id,
                ':screen_groups': this.screen_groups,
                ':rev': this._rev,
                ':new_rev': ++this._rev,
            },
            UpdateExpression: 'SET #venue_name = :name, content_id = :content_id, screen_groups = :screen_groups, #rev = :new_rev',
            ConditionExpression: "#rev = :rev",
            ReturnValues: 'ALL_NEW',
        };

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

    increaseRevision() {
        this._rev++;
    };
}

module.exports = Venue;
