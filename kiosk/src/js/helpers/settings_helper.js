'use strict';

const _ = require('lodash');

class SettingsHelper {

    static defineContentUrl(serverData, selectedValues) {
        let contentId = SettingsHelper.getContentId(serverData.settings, selectedValues.selectedScreenId);
        if (!contentId && selectedValues.selectedGroupId) {
            contentId = SettingsHelper.getContentId(serverData.settings, selectedValues.selectedGroupId);
        }
        if (!contentId && selectedValues.selectedVenueId) {
            contentId = SettingsHelper.getContentId(serverData.settings, selectedValues.selectedVenueId);
        }
        let selectedContent = _.find(serverData.content, c => c.id === contentId);
        return selectedContent ? selectedContent.url : '';
    }

    static getContentId(setting, itemId) {
        return setting.config[itemId];
    }
}

module.exports = SettingsHelper;