'use strict';

const electron = require('electron');
const path = require('path');
const url = require('url');
const BrowserWindow = electron.BrowserWindow;
const WindowInstanceHolder = require('./../window-instance-holder');


const isDev = require('electron-is-dev');
const log = require('electron-log');

class WindowsHelper {

    static openContentWindow(contentUrl) {
        WindowsHelper.createWindow(contentUrl, {
            webPreferences: {
                preload: path.join(__dirname, './../preload/remote_content_preload.js')
            }
        });
        WindowsHelper.hideCursor(WindowInstanceHolder.getWindow());
    }

    static createWindow(url, windowOptions = {}) {
        WindowsHelper.addDefaultOptions(windowOptions);
        let newWindow = new BrowserWindow(windowOptions);
        WindowInstanceHolder.setWindow(newWindow);

        WindowsHelper.loadWindowContent(url, newWindow);
        WindowsHelper.disableImagesDrugAndDrop(newWindow);
        WindowsHelper.openDevTools(newWindow);

        return newWindow;
    }

    static addDefaultOptions(windowOptions) {
        windowOptions.kiosk = true;
        windowOptions.frame = false;
        windowOptions.fullscreen = true;
        windowOptions.icon = __dirname + '/../../img/icon_128.ico';
    }

    static loadWindowContent(url, window) {
        if (url.startsWith('file')) {
            window.loadURL(url);
        } else {
            WindowsHelper.loadUrl(window, url);
        }
    }

    static disableImagesDrugAndDrop(window) {
        window.webContents.executeJavaScript('window.ondragstart = function(){return false};');
    }

    static openDevTools(window) {
        if (isDev) {
            window.webContents.openDevTools();
        }
    }

    static hideCursor(window) {
        window.webContents.on('did-finish-load', function () {
            window.webContents.insertCSS('*{ cursor: none !important; user-select: none;}')
        });
    }

    static loadUrl(browserWindow, url) {
        browserWindow.loadURL(url);

        browserWindow.webContents.on('did-fail-load', function (event, errorCode, errorDescription, validatedURL) {
            // -199 ... -100 - Connection related error codes (Chromium net errors)
            if (errorCode < -100 &&  errorCode > -200) {
                log.error(`Can not load url: ${validatedURL} ${errorCode} ${errorDescription}`);
                setTimeout(() => {
                    try {
                        log.info("Trying to load URL:", validatedURL);
                        browserWindow.loadURL(url);
                    } catch (error) {
                        log.info('Content load attempts have been interrupted. Reason: window was closed ')
                    }
                }, 5000);
            }
        });
    }

    static isAdminPanelOpened() {
        return WindowInstanceHolder.getWindow().webContents.getURL().startsWith('file:///');
    }

    static openAdminPanel() {
        let filePath = getAdminPanelUrl();
        WindowsHelper.createWindow(filePath);
    }
}

function getAdminPanelUrl() {
    return url.format({
        pathname: path.join(__dirname, '/../../admin_panel.html'),
        protocol: 'file:',
        slashes: true
    });
}

module.exports = WindowsHelper;