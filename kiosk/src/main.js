const electron = require('electron');
const {powerSaveBlocker} = require('electron');
const app = electron.app;

const path = require('path');
const url = require('url');
const CurrentScreenSettingsManager = require('./js/current_screen_settings_manager');
const WindowsHelper = require('./js/helpers/windows_helper');
const CronJobsManager = require('./js/helpers/cron_jobs_helper');
const Logger = require('./js/logger/logger');
const NotificationListener = require('./js/notification-listener/notification_listener');
const SettingMergeTool = require('./js/setting-merge-tool');
const SettingsHelper = require('./js/helpers/settings_helper');


const hotkey = require('electron-hotkey');
const {ipcMain} = require('electron');

let mainWindow;
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
    powerSaveBlocker.start('prevent-display-sleep');
    notificationListener = new NotificationListener();
    bindSettingChanges();
    openWindow();

    registerHotKeys();
    addHotKeyListeners();
    addEventListeners();
}

function openWindow() {
    CurrentScreenSettingsManager.getCurrentSetting().then(setting => {
        if (setting && setting.contentUrl) {
            prepareContentWindowData(setting);
        } else {
            openAdminPanel();
        }
    });
}

function prepareContentWindowData(setting) {
    CurrentScreenSettingsManager.reloadCurrentScreenConfig(setting)
        .then(contentUrl => openContentWindow(contentUrl))
        .catch(error => {
            Logger.error('Failed to load config. Used old config. Message:', error);
            openContentWindow(setting.contentUrl);
        });
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
            openAdminPanel();
        }
    });
}

function addEventListeners() {
    ipcMain.on('open-content-window', (event, contentUrl) => {
        openContentWindow(contentUrl);
    });
}

function openAdminPanel() {
    let filePath = getAdminPanelUrl();
    let newWindow = WindowsHelper.createWindow(filePath);
    closeCurrentWindow();
    mainWindow = newWindow;
}

function openContentWindow(contentUrl) {
    let newWindow = WindowsHelper.createWindow(contentUrl, {
        webPreferences: {
            preload: path.join(__dirname, 'js/preload/remote_content_preload.js')
        }
    });
    closeCurrentWindow();
    mainWindow = newWindow;
    hideCursor(mainWindow);
    settingsLoadJob = CronJobsManager.initSettingsLoadJob(mainWindow);
    subscribeToScreenReloadNotification();
}

function subscribeToScreenReloadNotification() {
    notificationListener.subscribe('screens', 'refresh', (data) => {
        CurrentScreenSettingsManager.getCurrentSetting().then(setting => {
            if (data.screens.includes(setting.selectedScreenId))
                mainWindow.reload();
        })
    });
}

function bindSettingChanges() {
    notificationListener.subscribe('screens', 'reload_config', (data) => {
        let mergedSetting = SettingMergeTool
            .startMerging()
            .setSettings(data.settings)
            .setPriorities(data.priorityTypes)
            .mergeConfigurations();
        data.settings = mergedSetting;
        CurrentScreenSettingsManager.getCurrentSetting().then(setting => {
            let contentUrl = SettingsHelper.defineContentUrl(data, setting);
            if (setting.contentUrl != contentUrl) {
                setting.contentUrl = contentUrl;
                CurrentScreenSettingsManager.saveCurrentSetting(setting);
                mainWindow.loadURL(setting.contentUrl);
            }
        });

    })
}

function closeCurrentWindow() {
    if (mainWindow) {
        mainWindow.close();
    }
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

