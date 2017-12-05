const electron = require('electron');
const {powerSaveBlocker} = require('electron');
const ApplicationUpdater = require('./js/application-updater');
const app = electron.app;

const path = require('path');
const url = require('url');
const CurrentScreenSettingsManager = require('./js/current_screen_settings_manager');
const WindowsHelper = require('./js/helpers/windows_helper');
const CronJobsManager = require('./js/helpers/cron_jobs_helper');
const Logger = require('./js/logger/logger');
const NotificationListener = require('./js/notification-listener/notification_listener');
const {scheduledTaskManager} = require('./js/scheduled-task-manager');
const StorageManager = require('./js/helpers/storage_manager');
const ServicesInitialiser = require('./js/services/services_initialiser');

const hotkey = require('electron-hotkey');

const _ = require('lodash');

ServicesInitialiser.initBaseServices();

let settingsLoadJob;
let notificationListener;

app.disableHardwareAcceleration();

app.on('ready', ready);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


function ready() {
    powerSaveBlocker.start('prevent-display-sleep');
    notificationListener = new NotificationListener();
    ServicesInitialiser.initBehaviourServices();

    registerHotKeys();
    addHotKeyListeners();

    settingsLoadJob = CronJobsManager.initSettingsLoadJob();

    StorageManager.loadDataFromLocalStorage().then(() => {
        openWindow();
        ApplicationUpdater.syncAppVersionOnApi();
        new ApplicationUpdater().init();
    }).catch(e => {
        Logger.info(e);
        openAdminPanel();
    });
}

function openWindow() {
    let setting = CurrentScreenSettingsManager.getCurrentSetting();
    if (setting && setting.contentUrl) {
        prepareContentWindowData(setting);
    } else {
        openAdminPanel();
    }
}

function prepareContentWindowData(screenInformation) {
    try {
        WindowsHelper.openContentWindow(screenInformation.contentUrl);
        CurrentScreenSettingsManager.changeScreenConfiguration();
    } catch (error) {
        Logger.error('Failed to load config. Used old config. Message:', error);
        WindowsHelper.openContentWindow(screenInformation.contentUrl);
    }
}

function registerHotKeys() {
    hotkey.register('global', 'Control+A', 'open-admin-panel');
}

function addHotKeyListeners() {
    app.on('shortcut-pressed', (event) => {
        if (event === 'open-admin-panel') {
            CronJobsManager.stopJob(settingsLoadJob);
            scheduledTaskManager.clearAllSchedules();
            openAdminPanel();
        }
    });
}

function openAdminPanel() {
    let filePath = getAdminPanelUrl();
    WindowsHelper.createWindow(filePath);
}

function getAdminPanelUrl() {
    return url.format({
        pathname: path.join(__dirname, 'admin_panel.html'),
        protocol: 'file:',
        slashes: true
    });
}

