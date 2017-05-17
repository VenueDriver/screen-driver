const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const storage = require('electron-json-storage');

const hotkey = require('electron-hotkey');
const {ipcMain} = require('electron');

let mainWindow;

function createWindow() {
    mainWindow = createWindow(getAdminPanelUrl());

    mainWindow.on('closed', function () {

    });

    hotkey.register('global', 'Control+A', 'event-1');

    app.on('shortcut-pressed', (event) => {
        if (event == 'event-1') {
            openAdminPanel();
        }
    });

    ipcMain.on('close-admin-panel', (event, contentUrl) => {
        openContentWindow(contentUrl);
    });

    function openAdminPanel() {
        let filePath = getAdminPanelUrl();
        let newWindow = createWindow(filePath);
        mainWindow.close();
        mainWindow = newWindow;
    }

    function openContentWindow(contentUrl) {
        let newWindow = createWindow(contentUrl, {webPreferences: {nodeIntegration: false}});
        mainWindow.close();
        mainWindow = newWindow;
        hideCursor(mainWindow);
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
        if (windowOptions.kiosk == undefined) {
            windowOptions.kiosk = true;
        }

        let newWindow = new BrowserWindow(windowOptions);
        newWindow.loadURL(url);
        newWindow.webContents.openDevTools();
        return newWindow;
    }
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
