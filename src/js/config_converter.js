class ConfigConverter {
    constructor() {
    }

    static extractVenues(venues) {
        let convertedVenues = {};
        venues.forEach(venue => {
            this.setParentUrlForEmptyChildren(venue);
            convertedVenues[venue.name] = this.extractGroups(venue);
        });
        return convertedVenues;
    }

    static extractGroups(venue) {
        let convertedGroups = {};
        venue.screen_groups.forEach(group => {
            convertedGroups[group.name] = this.extractScreens(group);
        });
        return convertedGroups;
    }

    static extractScreens(group) {
        let convertedScreens = {};
        group.screens.forEach(screen => {
            convertedScreens[screen.name] = screen.content ? screen.content.url : undefined;
        });
        return convertedScreens;
    }

    static setParentUrlForEmptyChildren(venue) {
        venue.screen_groups.forEach(group => {
            if (!group.content) group.content = {};
            if (!venue.content) venue.content ={};
            if (!group.content.url) {
                group['content'].url = venue.content.url;
            }

            group.screens.forEach(screen => {
                if (!screen.content) screen.content = {};
                if (!screen.content.url) {
                    screen['content'].url = group.content.url;
                }
            })
        })
    }

}

module.exports = ConfigConverter;
