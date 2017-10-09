const {autoUpdater} = require("electron-updater");
const CurrentScreenSettingsManager = require('./current_screen_settings_manager');
const NotificationListener = require('./notification-listener/notification_listener');
const PropertiesLoader = require('./helpers/properties_load_helper');
const UserInteractionsManager = require('./user-interactions-manager');
const Logger = require('./logger/logger');
const log = require('electron-log');

let instance = null;

class ApplicationUpdater {
    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    init() {
        initAutoUpdaterEvents();
        initPusherListener();
    }

    checkForUpdates() {
        autoUpdater.checkForUpdates();
    }
}

function initPusherListener() {
    let notificationListener = new NotificationListener();
    notificationListener.subscribe('screens', 'update', (data) => {
        let currentScreenId = CurrentScreenSettingsManager.getCurrentSetting().selectedScreenId;
        if (data.screens.includes(currentScreenId)) {
            UserInteractionsManager.applyWhenScreenNotInterruptedByUser(new ApplicationUpdater().checkForUpdates);
        }
    });
}

function initAutoUpdaterEvents() {
    autoUpdater.logger = Logger.getLogger();

    setFeedUrl();

    autoUpdater.on('update-availabe', () => {
        Logger.info('update available')
    });

    autoUpdater.on('error', () => {
        Logger.error('Auto update failed. Restart process...');
        autoUpdater.checkForUpdates();
    });

    autoUpdater.on('checking-for-update', () => {
        Logger.info('checking-for-update')
    });

    autoUpdater.on('update-not-available', () => {
        Logger.info('update-not-available')
    });

    autoUpdater.on('update-downloaded', (info) => {
        Logger.info(info);
        autoUpdater.quitAndInstall()
    });
}

//here is an thrown error inside on autoUpdater, but it seems to work ok.
function setFeedUrl() {
    let url = PropertiesLoader.getWindowsUpdateEndpoint();

    try {
        autoUpdater.setFeedURL({
            provider: 'generic',
            url: url
        });
    } catch (error) {
        Logger.info(error.message);
    }
}

module.exports = ApplicationUpdater;
