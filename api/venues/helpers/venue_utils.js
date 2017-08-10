'use strict';

const _ = require('lodash');

module.exports = class VenueUtils {

    static getAllItemIds(venue) {
        let itemIds = [venue.id];

        _.forEach(venue.screen_groups, group => {
            itemIds.push(...VenueUtils.getAllGroupItemIds(group));
        });

        return itemIds;
    }

    static getAllGroupItemIds(screenGroup) {
        let itemIds = [screenGroup.id];
        _.forEach(screenGroup.screens, screen => itemIds.push(screen.id));
        return itemIds;
    }

};