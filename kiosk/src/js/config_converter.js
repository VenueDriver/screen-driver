class ConfigConverter {
    constructor() {
    }

    static convert(venues) {
        console.log(venues);
        let convertedVenues = {};
        venues.forEach(venue => {
            this.setParentUrlForEmptyChildren(venue);
            convertedVenues[venue.name] = this.extractGroups(venue);
            convertedVenues[venue.name]._id = venue.id;
        });
        return convertedVenues;
    }

    static extractGroups(venue) {
        let convertedGroups = {};
        venue.screen_groups.forEach(group => {
            convertedGroups[group.name] = this.extractScreens(group);
            convertedGroups[group.name]._id = group.id;
        });
        return convertedGroups;
    }

    static extractScreens(group) {
        let convertedScreens = {};
        group.screens.forEach(screen => {
            convertedScreens[screen.name] = {};
            convertedScreens[screen.name].url = screen.content ? screen.content.url : undefined;
            convertedScreens[screen.name]._id = screen.id;
        });
        return convertedScreens;
    }

    static setParentUrlForEmptyChildren(venue) {
        venue.screen_groups.forEach(group => {
            if (!group.content) group.content = {};
            if (!venue.content) venue.content = {};
            if (!group.content.url) {
                group.content.url = venue.content.url;
            }

            group.screens.forEach(screen => {
                if (!screen.content) screen.content = {};
                if (!screen.content.url) {
                    screen.content.url = group.content.url;
                }
            })
        })
    }

}

module.exports = ConfigConverter;
