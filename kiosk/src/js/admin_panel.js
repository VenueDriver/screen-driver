const {app} = require('electron').remote;
const remote = require('electron').remote;
const {ipcRenderer} = require('electron');
const CurrentScreenSettingsManager = remote.require(__dirname + '/js/current_screen_settings_manager');
const DataLoader = remote.require(__dirname + '/js/data_loader');
const SettingsHelper = remote.require(__dirname + '/js/helpers/settings_helper');
const Logger = remote.require(__dirname + '/js/logger/logger');
const FileReader = remote.require(__dirname + '/js/helpers/file_reader');

const _ = require('lodash');

window.$ = window.jQuery = require('jquery');

let selectedVenue;
let selectedGroup;
let selectedScreen;

let contentUrl;

let screenSetting;
let serverData;
let currentShownSetting;

$(function () {
    showApplicationVersion();
    readLogs();

    function readLogs() {
        let logsFilePath = Logger.getLogsFileLocation();
        let logs = FileReader.readFile(logsFilePath);
        logs = highlightErrors(logs);

        insertLogsOnPage(logs);
    }

    function highlightErrors(logs) {
        return logs.replace(/\[error\]/g, '<span class="error">[error]</span>')
    }

    function insertLogsOnPage(logs) {
        let logsElement = $('#logs');
        let logLines = logs.split('\n');
        _.forEach(logLines, line => {
            logsElement.append(line);
            logsElement.append('<br>');
        });
    }

    $("#save").click(function () {
        if (verifySaveButtonState()) {
            saveSelectionInStorage();
            openContentWindow(contentUrl);
        }
    });

    $("#cancel").click(function () {
        let setting = CurrentScreenSettingsManager.getCurrentSetting();
        openContentWindow(setting.contentUrl);
    });

    $("#venue").change(function () {
        let venueSelectorElement = $(this);
        loadValues(venueSelectorElement, $('#screen-group'));
        if(!isVenueSelected(venueSelectorElement[0])) currentShownSetting = undefined;

        showCurrentSetting();
        clearLastSelector();
    });

    function isVenueSelected(venueSelectorElement) {
        return venueSelectorElement.value != 'none';
    }

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

    $("#show-logs").click(function () {
        $(this).hide();
        $("#hide-logs").show();

        let logsElement = $("#logs");
        logsElement.show();
        logsElement.scrollTop(logsElement[0].scrollHeight);
    });

    $("#hide-logs").click(function () {
        $(this).hide();
        $("#show-logs").show();
        $("#logs").hide();
    });
});

turnOnLogging();

loadData();

function turnOnLogging() {
    window.onerror = function(error, url, line) {
        ipcRenderer.send('errorInWindow', {error: error, url: url, line: line});
    };
}

function loadData() {
    DataLoader.loadData()
        .then(data => {
            serverData = data;
            loadCurrentSettings();
            verifySaveButtonState();
            verifyCancelButtonState();
            let setting = CurrentScreenSettingsManager.getCurrentSetting();

            currentShownSetting = findScreenSettings(setting, serverData)[0];
            showCurrentSetting();
        })
        .catch(error => {
            showError('Couldn\'t load settings');
            showCurrentSetting();
        });
}

function findScreenSettings(setting, serverData) {
    let originalSettings = serverData.originalSettings;

    let screensSettings = originalSettings.filter(originalSetting => isShownConfig(setting, originalSetting.config[setting.selectedScreenId]));
    return screensSettings ? screensSettings : [];
}

function isShownConfig(setting, originalSettingsValue) {
    let currentSettingsConfig = serverData.settings.config;
    let currentSettingsValue = currentSettingsConfig[setting.selectedScreenId];

    return currentSettingsValue == originalSettingsValue;
}

function updateCurrentSetting() {
    let setting = CurrentScreenSettingsManager.getCurrentSetting();
    currentShownSetting = findScreenSettings(setting, serverData)[0];
}

function loadCurrentSettings() {
    screenSetting = CurrentScreenSettingsManager.getCurrentSetting();
    initSelector($('#venue'), serverData.venues);
    initSelectorValues();
}

function initSelectorValues() {
    if (!_.isEmpty(screenSetting)) {
        findSelectedItems();
        putPreviouslySelectedDataIntoSelectors();
    }
}

function findSelectedItems() {
    selectedVenue = findById(serverData.venues, screenSetting.selectedVenueId);
    if (selectedVenue) {
        selectedGroup = findById(selectedVenue.screen_groups, screenSetting.selectedGroupId);
    }
    if (selectedGroup) {
        selectedScreen = findById(selectedGroup.screens, screenSetting.selectedScreenId);
    }
}

function putPreviouslySelectedDataIntoSelectors() {
    if (screenSetting.contentUrl) {
        $('#venue').val(screenSetting.selectedVenueId).trigger("change");
        $('#screen-group').val(screenSetting.selectedGroupId).trigger("change");
        $('#screen-id').val(screenSetting.selectedScreenId).trigger("change");
    }
}

function showError(errorMessage) {
    $("#config-load-error").text(errorMessage);
}


function defineContentUrl() {
    contentUrl = SettingsHelper.defineContentUrl(serverData, createObjectFromSelectedValues());
}

function verifySaveButtonState() {
    if (contentUrl && selectedScreen.id !== 'none') {
        enableSaveButton();
        return true;
    }
    disableSaveButton();
    return false;
}

function verifyCancelButtonState() {
    let setting = CurrentScreenSettingsManager.getCurrentSetting();
    if (_.isEmpty(setting) || _.isEmpty(setting.contentUrl)) {
        hideCancelButton();
    } else {
        showCancelButton();
    }
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
    CurrentScreenSettingsManager.saveCurrentSetting(createObjectFromSelectedValues());
}

function createObjectFromSelectedValues() {
    return {
        contentUrl: contentUrl,
        selectedScreenId: selectedScreen ? selectedScreen.id : '',
        selectedGroupId: selectedGroup ? selectedGroup.id : '',
        selectedVenueId: selectedVenue ? selectedVenue.id : ''
    }
}

function initSelector(selector, values) {
    _.forEach(_.sortBy(values, 'name'), value => {
        selector.append($('<option>', {
            value: value.id,
            text: value.name
        }));
    });
    selector.selectpicker('refresh');
}


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

function showApplicationVersion() {
    $('#version').text('v' + app.getVersion());
}

function showCurrentSetting() {
    if (!!currentShownSetting) {
        $('.current-setting-container').show();
        $('#current-setting').html(formatSetting(currentShownSetting));
    } else {
        $('.current-setting-container').hide();
    }
}

function formatSetting() {
    forciblyEnabledElement = currentShownSetting.forciblyEnabled ? '<span class="badge forcibly">forcibly</span>' : '';

    return currentShownSetting.name + forciblyEnabledElement;
}
