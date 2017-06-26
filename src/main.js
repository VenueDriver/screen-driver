const electron = require('electron');
const {powerSaveBlocker, net} = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const storage = require('electron-json-storage');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(__dirname + '/../config/app.properties');
const Q = require('q');
const CronJob = require('cron').CronJob;
let ConfigConverter = require('./js/config_converter');

const log = require('electron-log');
const hotkey = require('electron-hotkey');
const {ipcMain} = require('electron');

const isDev = require('electron-is-dev');

let mainWindow;
var screenConfig;
let configLoadJob;

setupLogger();

function getAllDataFromStorage() {
    let deferred = Q.defer();
    storage.getAll(function (error, data) {
        if (!error) {
            screenConfig = data;
            deferred.resolve(data);
        } else {
            log.error('Cannot read config from local storage.', error);
            deferred.reject(error);
        }

    });
    return deferred.promise;
}

function openWindow() {
    powerSaveBlocker.start('prevent-display-sleep');

    getAllDataFromStorage().then((data) => {
        if (data.contentUrl) {
            reloadCurrentScreenConfig(data)
                .then(() => openContentWindow(data.contentUrl))
                .done()
        } else {
            openAdminPanel();
        }
    }).done();



    registerHotKeys();
    addHotKeyListeners();
    addEventListeners();
}

/**
 *  @return {promise}. Promise can contain boolean value 'isUrlWasChanged', if config request was successful.
 */
function reloadCurrentScreenConfig(screenConfig) {
    let deferred = Q.defer();
    let url = properties.get('ScreenDriver.content.url');
    const request = net.request(url);
    request.on('response', (response) => {
        response.on('data', (chunk) => {
            let remoteConfig = convertConfig(chunk);
            let isUrlWasChanged = updateUrlForCurrentScreen(screenConfig, remoteConfig);
            deferred.resolve(isUrlWasChanged);

            function convertConfig() {
                try {
                    return ConfigConverter.extractVenues(chunk);
                } catch (error) {
                    log.error("Cannot read YAML config. Used old config. Message: " + error.message);
                    deferred.resolve();
                }
            }
        });

        response.on('error', (error) => {
            console.log(error);
            deferred.reject(error)
        })
    });

    request.on('error', (error) => {
        log.error('Failed to load YAML config. Used old config. Message:', error);
        deferred.resolve();
    });
    request.end();
    return deferred.promise;
}

/**
 *  @return {boolean}. Return was config updated or not
 */
function updateUrlForCurrentScreen(localScreenConfig, remoteScreenConfig) {
    try {
        let remoteUrl = getRemoteUrlForCurrentScreen();
        let localUrl = localScreenConfig.contentUrl;
        if (remoteUrl != localUrl) {
            localScreenConfig.contentUrl = remoteUrl;
            storage.set('contentUrl', remoteUrl, function (error) {
                if (error) throw error;
            });
            return true;
        }
    } catch (error) {
        log.error('Cannot update url for current screen.', error )
    }
    return false;

    function getRemoteUrlForCurrentScreen() {
        let selectedVenue = localScreenConfig.selectedVenue;
        let selectedGroup = localScreenConfig.selectedGroup;
        let selectedScreen = localScreenConfig.selectedScreen;
        return remoteScreenConfig[selectedVenue][selectedGroup][selectedScreen];
    }
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
            //configLoadJob can be undefined on first launch
            if (configLoadJob) {
                configLoadJob.stop();
            }
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
    initCronJobs();
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

function initCronJobs() {
    configLoadJob = new CronJob('*/5 * * * *', function() {
        getAllDataFromStorage()
            .then(reloadCurrentScreenConfig)
            .then((isUrlWasChanged) => {
                reloadWindowContent(isUrlWasChanged);
            })
            .done();
    }, null, true, 'UTC');
    configLoadJob.start();

    function reloadWindowContent(isUrlWasChanged) {
        if (isUrlWasChanged) {
            mainWindow.loadURL(screenConfig.contentUrl);
        }
    }
}

app.disableHardwareAcceleration();

app.on('ready', openWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
