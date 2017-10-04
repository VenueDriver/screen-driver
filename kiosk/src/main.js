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

const hotkey = require('electron-hotkey');
const {ipcMain} = require('electron');

let settingsLoadJob;
let notificationListener;

setupLogger();

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
    new ApplicationUpdater().init();
    StorageManager.loadDataFromLocalStorage().then(() => {
        powerSaveBlocker.start('prevent-display-sleep');
        notificationListener = new NotificationListener();
        openWindow();

        subscribeToScreenReloadNotification();
        subscribeToScheduleUpdate();
        bindSettingChanges();

        registerHotKeys();
        addHotKeyListeners();
        addEventListeners();
        settingsLoadJob = CronJobsManager.initSettingsLoadJob();
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

function subscribeToScreenReloadNotification() {
    notificationListener.subscribe('screens', 'refresh', (data) => {
        let setting = CurrentScreenSettingsManager.getCurrentSetting();
        if (data.screens.includes(setting.selectedScreenId)) {
            WindowInstanceHolder.getWindow().reload();
        }
    });
}

function subscribeToScheduleUpdate() {
    notificationListener.subscribe('screens', 'schedule_update', (event) => {
        CurrentScreenSettingsManager.changeScreenConfiguration();
    });
}


function initScheduling() {
    let screenInformation = CurrentScreenSettingsManager.getCurrentSetting();
    scheduledTaskManager.initSchedulingForScreen(screenInformation);
}

function bindSettingChanges() {
    notificationListener.subscribe('screens', 'setting_updated', (data) => {
        CurrentScreenSettingsManager.changeScreenConfiguration();
    })
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

