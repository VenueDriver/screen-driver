const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const storage = require('electron-json-storage');

let mainWindow;

function createWindow() {
    mainWindow = createWindow(getAdminPanelUrl());

    mainWindow.on('closed', function () {

    });

    const hotkey = require('electron-hotkey');
    hotkey.register('global', 'Control+A', 'event-1');
    hotkey.register('global', 'Control+B', 'event-2');


    app.on('shortcut-pressed', (event) => {
        if (event == 'event-1') {
            let filePath = getAdminPanelUrl();
            let newWindow = createWindow(filePath);
            mainWindow.close();
            mainWindow = newWindow;
        }

        if (event == 'event-2') {
            let newWindow = createWindow('http://touchscreen.hakkasan.com/', {webPreferences: {nodeIntegration: false}});
            mainWindow.close();
            mainWindow = newWindow;
        }
    });

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
