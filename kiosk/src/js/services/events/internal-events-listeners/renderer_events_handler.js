const {ipcMain} = require('electron');

const CurrentScreenSettingsManager = require('../../../current_screen_settings_manager');
const Logger = require('../../../logger/logger');
const UserInteractionsManager = require('../../../user-interactions-manager');
const WindowsHelper = require('../../../helpers/windows_helper');

/**
 * Should be used after application's 'ready' event was triggered
 */

ipcMain.on('open-content-window', (event, contentUrl) => {
    WindowsHelper.openContentWindow(contentUrl);
    CurrentScreenSettingsManager.changeScreenConfiguration();
});

ipcMain.on('user-interacted', function (event) {
    UserInteractionsManager.handleUserInteraction();
});

ipcMain.on('errorInWindow', function (event, data) {
    Logger.logGlobalError(data);
});
