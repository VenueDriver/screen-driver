'use strict';

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

const isDev = require('electron-is-dev');
const log = require('electron-log');

class WindowsHelper {

    static createWindow(url, windowOptions = {}) {
        WindowsHelper.addDefaultOptions(windowOptions);
        let newWindow = new BrowserWindow(windowOptions);

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

    static loadUrl(browserWindow, url) {
        browserWindow.loadURL(url);

        browserWindow.webContents.on('did-fail-load', function (event, errorCode, errorDescription, validatedURL) {
            log.error(`Can not load url: ${validatedURL} ${errorCode} ${errorDescription}`);
            // -199 ... -100 - Connection related errors (Chromium net errors)
            if (errorCode > -200 && errorCode <= -100) {
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
}

module.exports = WindowsHelper;