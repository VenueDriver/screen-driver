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
            this._rev = venue._rev ? venue._rev : 0;
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
        if (!this.name) deferred.reject('Venue can\'t be without name');
        if (this.name == '') deferred.reject('Venue can\'t be without name');
        if (!this._rev && this._rev !== 0) deferred.reject('Venue can\'t be without revision number');
        if (!Number.isInteger(Number(this._rev)) && this._rev !== 0) deferred.reject('Venue\'s revision should be a number');
        if (this._rev < 0) deferred.reject('Venue\'s revision can\'t be < 0');
        Venue.isUniqueName(this.name)
            .then(() => this.validateScreenGroups())
            .then(() => deferred.resolve())
            .fail((errorMessage) => deferred.reject(errorMessage));
        return deferred.promise;
    };

    validateScreenGroups() {
        let deferred = Q.defer();
        if (!this.screen_groups || this.screen_groups.size == 0) {
            deferred.resolve();
            return deferred.promise;
        }

        this.screen_groups.forEach(group => {
            _validateScreenGroupsNamesUniqueness(this.screen_groups, group);
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

    static isUniqueName(name) {
        let deferred = Q.defer();
        this.getAllExistingNames().then(names => {
            if (names.includes(name)) {
                deferred.reject('Venue with such name already exists')
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    static getAllExistingNames() {
        let deferred = Q.defer();
        let params = {TableName: process.env.VENUES_TABLE};
        db.scan(params, (error, data) => {
            if (error) {
                deferred.reject(error.message);
            } else {
                let names = data.Items.map(venue => venue.name);
                deferred.resolve(names);
            }
        });
        return deferred.promise;
    }

    generateId() {
        this.id = uuid.v1();
    };

    increaseRevision() {
        this._rev++;
    };
}

module.exports = Venue;
