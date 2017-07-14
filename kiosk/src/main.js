const electron = require('electron');
const {powerSaveBlocker, net} = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const storage = require('electron-json-storage');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(__dirname + '/../config/app.properties');
const DataLoader = require('./js/data_loader');
const {LocalStorageManager, StorageNames} = require('./js/local_storage_manager');


const log = require('electron-log');
const hotkey = require('electron-hotkey');
const {ipcMain} = require('electron');

const isDev = require('electron-is-dev');

let mainWindow;

setupLogger();

app.disableHardwareAcceleration();

app.on('ready', ready);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

function ready() {
    DataLoader.loadData();
    openWindow();
}

function openWindow() {
    powerSaveBlocker.start('prevent-display-sleep');

    openAdminPanel();

    registerHotKeys();
    addHotKeyListeners();
    addEventListeners();
}

function setupLogger() {
    setupLoggerProperties();
    addListenerForErrors();
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
    let newWindow = createWindow(filePath);
    closeCurrentWindow();
    mainWindow = newWindow;
}

function openContentWindow(contentUrl) {
    let newWindow = createWindow(contentUrl, {
        webPreferences: {
            preload: path.join(__dirname, 'js/remote_content_preload.js')
        }
    });
    closeCurrentWindow();
    mainWindow = newWindow;
    hideCursor(mainWindow);
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

function createWindow(url, windowOptions = {}) {
    if (!windowOptions.kiosk) {
        windowOptions.kiosk = true;
    }

    windowOptions.icon = __dirname + '/img/icon_128.ico';

    let newWindow = new BrowserWindow(windowOptions);
    loadUrl(newWindow, url);

    //disable images drag & drop
    newWindow.webContents.executeJavaScript('window.ondragstart = function(){return false};');
    if (isDev) {
        newWindow.webContents.openDevTools();
    }
    return newWindow;
}

function loadUrl(browserWindow, url) {
    browserWindow.loadURL(url);

    browserWindow.webContents.on('did-fail-load', function (event, errorCode, errorDescription, validatedURL) {
        log.error(`Can not load url: ${validatedURL} ${errorCode} ${errorDescription}`);
        // 100-199 Connection related errors (Chromium net errors)
        if (errorCode > -200 && errorCode <= -100) {
            setTimeout(function () {
                try {
                    log.info("Trying to load url:", validatedURL);
                    browserWindow.loadURL(url);
                } catch (error) {
                    log.info('Content load attempts have been interrupted. Reason: window was closed ')
                }
            }, 5000);
        }
    });
}
