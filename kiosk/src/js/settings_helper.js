class SettingsHelper {

    static getContentId(settings, itemId) {
        return settings[0].config[itemId];
    }
}

module.exports = SettingsHelper;