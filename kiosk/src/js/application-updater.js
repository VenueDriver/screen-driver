const autoUpdater = require("electron-updater").autoUpdater;
const CurrentScreenSettingsManager = require('./current_screen_settings_manager');
const NotificationListener = require('./notification-listener/notification_listener');
const PropertiesLoader = require('./helpers/properties_load_helper');
const UserInteractionsManager = require('./user-interactions-manager');
const NetworkErrorsHandlingService = require('./services/error/network_errors_handling_service');
const ConnectionStatusService = require('./services/network/connection_status_service');
const Logger = require('./logger/logger');

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

    setDownloadingStatus(boolean) {
        this.isUpdateDownloading = boolean;
    }

    getDownloadingStatus() {
        return this.isUpdateDownloading;
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

    autoUpdater.on('update-available', () => {
        new ApplicationUpdater().setDownloadingStatus(true);
        runConnectionWatchers();
        Logger.info('update available');
    });

    autoUpdater.on('error', () => {
        Logger.error('Auto update failed. Restart process...');
        startAutoupdateOnConnectionEstablised()
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

    autoUpdater.on('download-progress', (progressObj) => {
        let log_message = "Download speed: " + progressObj.bytesPerSecond * 0.001 + " kB/s";
        log_message = log_message + ' - Downloaded ' + progressObj.percent.toFixed(2) + '%';
        log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
        Logger.info(log_message);
    })

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


function runConnectionWatchers() {
    startAutoupdateOnConnectionEstablised();

    NetworkErrorsHandlingService.getErrors().subscribe(() => {
        if (new ApplicationUpdater().getDownloadingStatus()) {
            startAutoupdateOnConnectionEstablised()
        }
    })

}

function startAutoupdateOnConnectionEstablised() {
    ConnectionStatusService.runWhenPossible(() => {
        Logger.info('Connection established. Auto-update has been restarted');
        new ApplicationUpdater().checkForUpdates();
    });
}

module.exports = ApplicationUpdater;
