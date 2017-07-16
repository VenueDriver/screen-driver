const electron = require('electron');
const {powerSaveBlocker} = require('electron');
const app = electron.app;

const path = require('path');
const url = require('url');
const storage = require('electron-json-storage');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(__dirname + '/../config/app.properties');
const CurrentScreenSettingsManager = require('./js/current_screen_settings_manager');
const WindowsHelper = require('./js/windows_helper');
const CronJobsManager = require('./js/cron_jobs_manager');

const log = require('electron-log');
const hotkey = require('electron-hotkey');
const {ipcMain} = require('electron');

const isDev = require('electron-is-dev');

let mainWindow;
let settingsLoadJob;

setupLogger();

app.disableHardwareAcceleration();

app.on('ready', ready);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

function setupLogger() {
    setupLoggerProperties();
    addListenerForErrors();
}

function ready() {
    powerSaveBlocker.start('prevent-display-sleep');

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
            log.error('Failed to load config. Used old config. Message:', error);
            openContentWindow(setting.contentUrl);
        });
}

function setupLoggerProperties() {
    log.transports.file.level = 'error';
    log.transports.file.maxSize = 10 * 1024 * 1024;

    let logFilePath = getLogFilePath();
    log.transports.file.file = logFilePath + '/error.log';
}

function getLogFilePath() {
    if (isDev) {
        return __dirname;
    }
    return process.cwd();
}

function addListenerForErrors() {
    ipcMain.on('errorInWindow', function(event, data) {
        let fileName = data.url.substr(data.url.indexOf('app.asar'));
        fileName = fileName.replace('app.asar', '');
        let errorMessage = data.error.trim();
        log.error(`${errorMessage}, ${fileName}:${data.line}`);
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
            preload: path.join(__dirname, 'js/remote_content_preload.js')
        }
    });
    closeCurrentWindow();
    mainWindow = newWindow;
    hideCursor(mainWindow);
    settingsLoadJob = CronJobsManager.initSettingsLoadJob(mainWindow);
}

function closeCurrentWindow() {
    if (mainWindow) {
        mainWindow.close();
    }
}

function hideCursor(window) {
    window.webContents.on('did-finish-load', function() {
        window.webContents.insertCSS('*{ cursor: none !important; user-select: none;}')
    });
}

function getAdminPanelUrl() {
    return url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    });
}

