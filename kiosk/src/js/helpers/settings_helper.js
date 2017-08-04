'use strict';

const _ = require('lodash');

class SettingsHelper {

    static defineContentUrl(serverData, selectedValues) {
        let contentId = SettingsHelper.defineContentId(serverData.settings, selectedValues);
        let selectedContent = _.find(serverData.content, c => c.id === contentId);
        return selectedContent ? selectedContent.url : '';
    }

    static defineContentId(settings, selectedValues) {
        let contentId = SettingsHelper.getContentId(settings, selectedValues.selectedScreenId);
        if (!contentId && selectedValues.selectedGroupId) {
            contentId = SettingsHelper.getContentId(settings, selectedValues.selectedGroupId);
        }
        if (!contentId && selectedValues.selectedVenueId) {
            contentId = SettingsHelper.getContentId(settings, selectedValues.selectedVenueId);
        }
        return contentId;
    }

    static getContentId(setting, itemId) {
        return setting.config[itemId];
    }
}

module.exports = SettingsHelper;