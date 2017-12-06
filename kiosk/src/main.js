const electron = require('electron');
const {powerSaveBlocker} = require('electron');
const ApplicationUpdater = require('./js/application_updater');
const app = electron.app;

const CurrentScreenSettingsManager = require('./js/current_screen_settings_manager');
const WindowsHelper = require('./js/services/windows/windows_helper');
const SettingsLoadJobManager = require('./js/services/data/server_data_load_job');
const Logger = require('./js/services/logger/logger');
const StorageManager = require('./js/helpers/storage_manager');
const ServicesInitialiser = require('./js/services/services_initialiser');

const hotkey = require('electron-hotkey');

const _ = require('lodash');

ServicesInitialiser.initBaseServices();

app.disableHardwareAcceleration();

app.on('ready', ready);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


function ready() {
    powerSaveBlocker.start('prevent-display-sleep');
    ServicesInitialiser.initBehaviourServices();
    registerHotKeys();

    StorageManager.loadDataFromLocalStorage().then(() => {
        openWindow();
        ApplicationUpdater.syncAppVersionOnApi();
        new ApplicationUpdater().init();
    }).catch(e => {
        Logger.info(e);
        WindowsHelper.openAdminPanel();
    });
}

function openWindow() {
    let setting = CurrentScreenSettingsManager.getCurrentSetting();
    if (setting && setting.contentUrl) {
        prepareContentWindowData(setting);
    } else {
        WindowsHelper.openAdminPanel();
    }
}

function prepareContentWindowData(screenInformation) {
    try {
        WindowsHelper.openContentWindow(screenInformation.contentUrl);
        CurrentScreenSettingsManager.changeScreenConfiguration();
    } catch (error) {
        Logger.error('Failed to load config. Used old config. Message:', error);
        WindowsHelper.openContentWindow(screenInformation.contentUrl);
    }
}

function registerHotKeys() {
    hotkey.register('global', 'Control+A', 'open-admin-panel');
}
