const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const storage = require('electron-json-storage');

const hotkey = require('electron-hotkey');
const {ipcMain} = require('electron');

let mainWindow;

function openWindow() {
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
    ipcMain.on('close-admin-panel', (event, contentUrl) => {
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
    let newWindow = createWindow(contentUrl, {webPreferences: {nodeIntegration: false}});
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
        window.webContents.insertCSS('*{ cursor: none !important;}')
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

    let newWindow = new BrowserWindow(windowOptions);
    newWindow.loadURL(url);
    newWindow.webContents.openDevTools();
    return newWindow;
}

app.on('ready', openWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
