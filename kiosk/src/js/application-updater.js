const app = require('electron').app;
const autoUpdater = require("electron-updater").autoUpdater;
const CurrentScreenSettingsManager = require('./current_screen_settings_manager');
const cron = require('node-cron');
const NotificationListener = require('./notification-listener/notification_listener');
const PropertiesLoader = require('./helpers/properties_load_helper');
const UserInteractionsManager = require('./user-interactions-manager');
const NetworkErrorsHandlingService = require('./services/error/network_errors_handling_service');
const AutoupdateScheduleWatcher = require('./services/data/autoupdate_schedule_watcher');
const ConnectionStatusService = require('./services/network/connection_status_service');
const Logger = require('./logger/logger');
const DataSender = require('./data_sender');
const DataStorage = require('./storage/data_storage');
const LocalStorageManager = require('./helpers/local_storage_helper').LocalStorageManager;
const appVersionStorageName = require('./helpers/local_storage_helper').StorageNames.APP_VERSION;
const _ = require('lodash');

let instance = null;
let autoUpdateCronJob;

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
        initScheduleUpdateListener();
        initUpdateScheduleConfigListener();
        scheduleAutoUpdate();
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

    static syncAppVersionOnApi() {
        let notify = (newVersion) => {
            let screenId = CurrentScreenSettingsManager.getCurrentSetting().selectedScreenId;
            let requestData = {screenId: screenId, version: newVersion || '0.0.0'};
            if (!screenId) throw new Error('Couldn\'t send Kiosk version. Reason: missed screen id');
            DataSender.sendApplicationVersion(requestData);
        };

        LocalStorageManager.getFromStorage(appVersionStorageName, (error, version) => {
            let currentVersion = app.getVersion();
            if (currentVersion != version) {
                notify(currentVersion);
                LocalStorageManager.putInStorage(appVersionStorageName, currentVersion)
            }
        })
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
        startAutoupdateOnConnectionEstablished()
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

function initScheduleUpdateListener() {
    AutoupdateScheduleWatcher.getWatcher()
        .subscribe(scheduleAutoUpdate);
}

function scheduleAutoUpdate() {
    let scheduleForCurrentVenue = findScheduleForCurrentVenue();
    if (!_.isEmpty(scheduleForCurrentVenue)) {
        createBackgroundJobForUpdatesChecker(scheduleForCurrentVenue);
    }
}

function findScheduleForCurrentVenue() {
    let venueId = getCurrentVenueId();
    let schedules = DataStorage.getServerData().updateSchedules;
    return _.find(schedules, schedule => schedule.id === venueId && schedule.isEnabled);
}

function createBackgroundJobForUpdatesChecker(schedule) {
    destroyBackgroundJobForUpdatesCheckerIfExists();

    autoUpdateCronJob = cron.schedule(
        schedule.eventTime,
        () => new ApplicationUpdater().checkForUpdates(),
        true
    ).start();
}

function destroyBackgroundJobForUpdatesCheckerIfExists() {
    if (!_.isEmpty(autoUpdateCronJob)) {
        autoUpdateCronJob.destroy();
        autoUpdateCronJob = null;
    }
}

function initUpdateScheduleConfigListener() {
    let notificationListener = new NotificationListener();
    notificationListener.subscribe('venues', 'auto_update_schedule_updated', (data) => handleUpdateScheduleEvent(data));
}

function handleUpdateScheduleEvent(schedule) {
    let venueId = getCurrentVenueId();
    if (_.isEmpty(schedule) || schedule.id !== venueId) {
        return;
    }
    if (!schedule.isEnabled) {
        destroyBackgroundJobForUpdatesCheckerIfExists();
        return;
    }
    createBackgroundJobForUpdatesChecker(schedule);
}

function getCurrentVenueId() {
    return CurrentScreenSettingsManager.getCurrentSetting().selectedVenueId;
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
    startAutoupdateOnConnectionEstablished();

    NetworkErrorsHandlingService.getErrors().subscribe(() => {
        if (new ApplicationUpdater().getDownloadingStatus()) {
            startAutoupdateOnConnectionEstablished()
        }
    })

}

function startAutoupdateOnConnectionEstablished() {
    ConnectionStatusService.runWhenPossible(() => {
        Logger.info('Connection established. Auto-update has been restarted');
        new ApplicationUpdater().checkForUpdates();
    });
}

module.exports = ApplicationUpdater;
