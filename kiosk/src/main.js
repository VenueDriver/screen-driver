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
const WindowInstanceHolder = require('./js/window-instance-holder');
const StorageManager = require('./js/helpers/storage_manager');
const UserInteractionsManager = require('./js/user-interactions-manager');
const UncaughtErrorsHandlingService = require('./js/services/error/uncaught_errors_handling_service');
const ServicesInitialiser = require('./js/services/services_initialiser');

const hotkey = require('electron-hotkey');
const {ipcMain} = require('electron');

const _ = require('lodash');

setupLogger();
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

function setupLogger() {
    Logger.setupLoggerProperties();
    addListenerForErrors();
}

function ready() {
    powerSaveBlocker.start('prevent-display-sleep');
    notificationListener = new NotificationListener();
    ServicesInitialiser.initBehaviourServices();

    registerHotKeys();
    addHotKeyListeners();
    addEventListeners();
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
        openContentWindow(screenInformation.contentUrl);
        CurrentScreenSettingsManager.changeScreenConfiguration();
    } catch (error) {
        Logger.error('Failed to load config. Used old config. Message:', error);
        openContentWindow(screenInformation.contentUrl);
    }
}

function addListenerForErrors() {
    ipcMain.on('errorInWindow', function (event, data) {
        Logger.logGlobalError(data);
    });

    process.on('uncaughtException', function (error) {
        UncaughtErrorsHandlingService.registerError(error);
    });
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

function addEventListeners() {
    ipcMain.on('open-content-window', (event, contentUrl) => {
        openContentWindow(contentUrl);
        CurrentScreenSettingsManager.changeScreenConfiguration();
    });

    ipcMain.on('user-interacted', function (event) {
        UserInteractionsManager.handleUserInteraction();
    });
}

function openAdminPanel() {
    let filePath = getAdminPanelUrl();
    WindowsHelper.createWindow(filePath);
}

function openContentWindow(contentUrl) {
    WindowsHelper.createWindow(contentUrl, {
        webPreferences: {
            preload: path.join(__dirname, 'js/preload/remote_content_preload.js')
        }
    });
    hideCursor(WindowInstanceHolder.getWindow());
}

function hideCursor(window) {
    window.webContents.on('did-finish-load', function () {
        window.webContents.insertCSS('*{ cursor: none !important; user-select: none;}')
    });
}

function getAdminPanelUrl() {
    return url.format({
        pathname: path.join(__dirname, 'admin_panel.html'),
        protocol: 'file:',
        slashes: true
    });
}

