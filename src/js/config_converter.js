class ConfigConverter {
    constructor() {
    }

    static extractVenues(json_config) {
        json_config = JSON.parse(json_config);
        let convertedVenues = {};
        json_config.forEach(venue => {
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
}

module.exports = ConfigConverter;
