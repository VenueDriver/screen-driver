const ApiEventsListenerService = require('./api_events_listener_service');
const CurrentScreenSettingsManager = require('../../../current_screen_settings_manager');
const WindowsHelper = require('../../../helpers/windows_helper');
const WindowInstanceHolder = require('../../../window_instance_holder');

const _ = require('lodash');

class ApiEventsHandlerService {

    static init() {
        handleSettingChanges();
        handleScheduleChanges();
        handleScreenReloadSignal();
    }
}

function handleScheduleChanges() {
    ApiEventsListenerService.onScheduleUpdated(event => {
        CurrentScreenSettingsManager.changeScreenConfiguration();
    })
}

function handleSettingChanges() {
    ApiEventsListenerService.onSettingUpdated(data => {
        CurrentScreenSettingsManager.changeScreenConfiguration();
    })
}

function handleScreenReloadSignal() {
    ApiEventsListenerService.onScreenReloadSignal(data => {
        let setting = CurrentScreenSettingsManager.getCurrentSetting();
        let ableToReload = !_.isEmpty(setting) &&
            data.screens.includes(setting.selectedScreenId) &&
            !WindowsHelper.isAdminPanelOpened();

        if (ableToReload) {
            WindowInstanceHolder.getWindow().reload();
        }
    })
}


module.exports = ApiEventsHandlerService;
