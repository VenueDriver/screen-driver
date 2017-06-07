const electron = require('electron');
const {powerSaveBlocker} = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const storage = require('electron-json-storage');

const log = require('electron-log');
const hotkey = require('electron-hotkey');
const {ipcMain} = require('electron');

const isDev = require('electron-is-dev');

let mainWindow;

setupLogger();

function openWindow() {
    powerSaveBlocker.start('prevent-display-sleep');

    storage.getAll(function(error, data) {
        if (data.contentUrl) {
            openContentWindow(data.contentUrl);
        } else {
            openAdminPanel();
        }
    });

    registerHotKeys();
    addHotKeyListeners();
    addEventListeners();
}

function setupLogger() {
    log.transports.file.level = 'error';
    log.transports.file.maxSize = 10 * 1024 * 1024;
    log.transports.file.file = '/home/employee/log.txt';

    ipcMain.on('errorInWindow', function(event, data) {
        let fileName = data.url.substr(data.url.indexOf('screen-driver'));
        fileName = fileName.replace('screen-driver', '');
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
    newWindow.loadURL(url);
    //disable images drag & drop
    newWindow.webContents.executeJavaScript('window.ondragstart = function(){return false};');
    if (isDev) {
        newWindow.webContents.openDevTools();
    }
    return newWindow;
}

app.disableHardwareAcceleration();

app.on('ready', openWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
