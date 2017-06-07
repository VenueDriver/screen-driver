const electron = require('electron');
const {powerSaveBlocker} = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const storage = require('electron-json-storage');

const hotkey = require('electron-hotkey');
const {ipcMain} = require('electron');

const isDev = require('electron-is-dev');

let mainWindow;

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
        console.log('Can not load url:', validatedURL, errorCode, errorDescription);
        // 100-199 Connection related errors (Chromium net errors)
        if (errorCode > -200 && errorCode <= -100) {
            setTimeout(function () {
                console.log("Trying to load url:", validatedURL);
                browserWindow.loadURL(url);
            }, 5000);
        }
    });
}

app.disableHardwareAcceleration();

app.on('ready', openWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
