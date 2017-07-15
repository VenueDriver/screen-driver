const remote = require('electron').remote;
const {ipcRenderer} = require('electron');
const fs = require('fs');
const os = require('os');
const isDev = require('electron-is-dev');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(__dirname + '/../config/app.properties');
const {LocalStorageManager, StorageNames} = remote.require(__dirname + '/js/local_storage_manager');
const CurrentScreenSettingsManager = remote.require(__dirname + '/js/current_screen_settings_manager');
const DataLoader = remote.require(__dirname + '/js/data_loader');
const SettingsHelper = remote.require(__dirname + '/js/settings_helper');

const _ = require('lodash');

window.$ = window.jQuery = require('jquery');

let screenSetting;
let serverData;

$(function () {
    readLog();
    turnOnLogging();

    loadData();

    let selectedVenue;
    let selectedGroup;
    let selectedScreen;

    let contentUrl;

    verifySaveButtonState();
    verifyCancelButtonState();

    function loadData() {
        DataLoader.loadData().then(data => {
            serverData = data;
            loadCurrentSettings();
        });
    }

    function loadCurrentSettings() {
        CurrentScreenSettingsManager.getCurrentSetting().then(setting => {
            screenSetting = setting;
            initSelector($('#venue'), serverData.venues);
            initSelectorValues();
        });
    }

    function initSelectorValues() {
        if (!_.isEmpty(screenSetting)) {
            findSelectedItems();
            putPreviouslySelectedDataIntoSelectors();
        }
    }

    function findSelectedItems() {
        selectedVenue = findById(serverData.venues, screenSetting.selectedVenueId);
        selectedGroup = findById(selectedVenue.screen_groups, screenSetting.selectedGroupId);
        selectedScreen = findById(selectedGroup.screens, screenSetting.selectedScreenId);
    }

    function putPreviouslySelectedDataIntoSelectors() {
        if (screenSetting.contentUrl) {
            $('#venue').val(screenSetting.selectedVenueId).trigger("change");
            $('#screen-group').val(screenSetting.selectedGroupId).trigger("change");
            $('#screen-id').val(screenSetting.selectedScreenId).trigger("change");
        }
    }

    $("#save").click(function () {
        if (verifySaveButtonState()) {
            saveSelectionInStorage();
            openContentWindow(contentUrl);
        }
    });

    $("#cancel").click(function () {
        CurrentScreenSettingsManager.getCurrentSetting().then(setting => {
            openContentWindow(setting.contentUrl);
        });
    });

    $("#venue").change(function () {
        loadValues($(this), $('#screen-group'));
        clearLastSelector();
    });

    $("#screen-group").change(function () {
        loadValues($(this), $('#screen-id'));
    });

    $("#screen-id").change(function () {
        let screenId = $('#screen-id').find(":selected").val();
        if (!screenId || screenId === 'none') {
            return;
        }
        selectedScreen = findById(selectedGroup.screens, screenId);
        defineContentUrl();
        verifySaveButtonState();
    });

    function defineContentUrl() {
        let contentId = SettingsHelper.getContentId(serverData.settings, selectedScreen.id);
        if (!contentId && selectedGroup) {
            contentId = SettingsHelper.getContentId(serverData.settings, selectedGroup.id);
        }
        if (!contentId && selectedVenue) {
            contentId = SettingsHelper.getContentId(serverData.settings, selectedVenue.id);
        }
        let selectedContent = serverData.content.find(c => c.id === contentId);
        contentUrl = selectedContent ? selectedContent.url : '';
    }

    function verifySaveButtonState() {
        if (!contentUrl || selectedScreen.id === 'none') {
            disableSaveButton();
            return false;
        }
        enableSaveButton();
        return true;
    }

    function verifyCancelButtonState() {
        CurrentScreenSettingsManager.getCurrentSetting().then(setting => {
            if (_.isEmpty(setting.contentUrl)) {
                hideCancelButton();
            } else {
                showCancelButton();
            }
        });
    }

    function loadValues(sourceDropdown, destinationDropdown) {
        let selectedDropdownValue = sourceDropdown.find(":selected").val();
        if (selectedDropdownValue && selectedDropdownValue !== 'none') {
            let valuesForDropdown = getValuesForDropdown(sourceDropdown, selectedDropdownValue);
            performValuesLoading(destinationDropdown, valuesForDropdown);
        }
    }

    function getValuesForDropdown(sourceDropdown, selectedDropdownValue) {
        switch (sourceDropdown.attr('id')) {
            case ('venue'):
                selectedVenue = findById(serverData.venues, selectedDropdownValue);
                return selectedVenue.screen_groups;
            case ('screen-group'):
                if (selectedVenue) {
                    selectedGroup = findById(selectedVenue.screen_groups, selectedDropdownValue);
                    return selectedGroup.screens;
                }
        }
    }

    function findById(items, itemId) {
        return _.find(items, item => item.id === itemId);
    }

    function performValuesLoading(destinationDropdown, valuesForDropdown) {
        destinationDropdown.empty();
        setDefaultEmptyValue(destinationDropdown);
        if (valuesForDropdown) {
            initSelector(destinationDropdown, valuesForDropdown);
        }
    }

    function saveSelectionInStorage() {
        CurrentScreenSettingsManager.saveCurrentSetting({
            contentUrl: contentUrl,
            selectedScreenId: selectedScreen.id,
            selectedGroupId: selectedGroup.id,
            selectedVenueId: selectedVenue.id
        });
    }

    $("#show-logs").click(function () {
        $(this).hide();
        $("#hide-logs").show();
        $("#logs").show();
    });

    $("#hide-logs").click(function () {
        $(this).hide();
        $("#show-logs").show();
        $("#logs").hide();
    });

    function initSelector(selector, values) {
        _.forEach(values, value => {
            selector.append($('<option>', {
                value: value.id,
                text: value.name
            }));
        });
        selector.selectpicker('refresh');
    }
});

function openContentWindow(contentUrl) {
    ipcRenderer.send('open-content-window', contentUrl);
}

function clearLastSelector() {
    // TODO: maybe we can do it in better way (e.g. trigger event select option)
    let screenIdDropdown = $("#screen-id");
    screenIdDropdown.empty();
    setDefaultEmptyValue(screenIdDropdown);
    screenIdDropdown.selectpicker('refresh');
}

function setDefaultEmptyValue(dropdown) {
    dropdown.append($('<option>', {
        value: 'none',
        text: 'Not selected'
    }));
    dropdown.trigger("change");
}

function enableSaveButton() {
    $('#save').removeClass('disabled');
}

function disableSaveButton() {
    $('#save').addClass('disabled');
}

function showCancelButton() {
    $('#cancel').show();
}

function hideCancelButton() {
    $('#cancel').hide();
}

function showError(errorMessage) {
    $("#config-load-error").text(errorMessage);
}

function turnOnLogging() {
    window.onerror = function(error, url, line) {
        ipcRenderer.send('errorInWindow', {error: error, url: url, line: line});
    };
}

function readLog() {
    let logFilePath = getLogFileLocation();
    if (fs.existsSync(logFilePath)) {
        let logs = fs.readFileSync(logFilePath, 'utf8');
        insertLogsOnPage(logs);
    }
}

function insertLogsOnPage(logs) {
    let logsElement = $('#logs');
    let logLines = logs.split('\n').reverse();
    _.forEach(logLines, line => {
        logsElement.append(line);
        logsElement.append('<br>');
    });
}

function getLogFileLocation() {
    let rootPath = process.cwd();
    if (isDev) {
        rootPath = __dirname;
    }
    return getLocationForPlatform(rootPath)
}

function getLocationForPlatform(rootPath) {
    let platform = os.platform();
    switch (platform) {
        case 'linux': return rootPath + '/error.log';
        case 'win32': return rootPath + '\\error.log';
    }
}