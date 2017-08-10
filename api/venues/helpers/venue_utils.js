
const _ = require('lodash');

module.exports = class VenueUtils {

    static getAllItemIds(venue) {
        let itemIds = [venue.id];

        _.forEach(venue.screen_groups, group => {
            itemIds.push(group.id);
            _.forEach(group.screens, screen => itemIds.push(screen.id));
        });

        return itemIds;
    }

};