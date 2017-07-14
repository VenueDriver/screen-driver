const remote = require('electron').remote;
const storage = require('electron-json-storage');
const {ipcRenderer} = require('electron');
const fs = require('fs');
const os = require('os');
const isDev = require('electron-is-dev');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(__dirname + '/../config/app.properties');
const {LocalStorageManager, StorageNames} = remote.require(__dirname + '/js/local_storage_manager');
const SettingsManager = remote.require(__dirname + '/js/settings_manager');
const DataLoader = remote.require(__dirname + '/js/data_loader');

window.$ = window.jQuery = require('jquery');

let screenSetting;
let content;
let venues;
let settings;

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
        DataLoader.loadData().then(values => {
            venues = JSON.parse(values[0]);
            content = JSON.parse(values[1]);
            settings = JSON.parse(values[2]);
            loadCurrentSettings();
        });
    }

    function loadCurrentSettings() {
        LocalStorageManager.getFromStorage(StorageNames.SELECTED_SETTING_STORAGE, (error, data) => {
            screenSetting = data;
            initSelector($('#venue'), venues);
            putPreviouslySelectedDataIntoSelectors();
        });
    }

    function putPreviouslySelectedDataIntoSelectors() {
        if (screenSetting.contentUrl) {
            selectedVenue = findById(venues, screenSetting.selectedVenueId);
            $('#venue').val(selectedVenue.name).trigger("change");

            selectedGroup = findById(selectedVenue.screen_groups, screenSetting.selectedGroupId);
            $('#screen-group').val(selectedGroup.name).trigger("change");

            selectedScreen = findById(selectedGroup.screens, screenSetting.selectedScreenId);
            $('#screen-id').val(selectedScreen.name).trigger("change");
        }
    }

    $("#save").click(function () {
        if (verifySaveButtonState()) {
            saveSelectionInStorage();
            openContentWindow(contentUrl);
        }
    });

    $("#cancel").click(function () {
        getFromStorage('contentUrl', function (error, contentUrl) {
            openContentWindow(contentUrl);
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
        let contentId = settings[0].config[selectedScreen.id];
        if (!contentId && selectedGroup) {
            contentId = settings[0].config[selectedGroup.id];
        }
        if (!contentId && selectedVenue) {
            contentId = settings[0].config[selectedVenue.id];
        }
        let selectedContent = content.find(c => c.id === contentId);
        contentUrl = selectedContent ? selectedContent.url : '';
    }

    function verifySaveButtonState() {
        if (!contentUrl || selectedScreen.id === 'none') {
            disableSaveButton();
            return false;
        } else {
            enableSaveButton();
            return true;
        }
    }

    function verifyCancelButtonState() {
        getFromStorage('contentUrl', function (err, contentUrl) {
            if ($.isEmptyObject(contentUrl)) {
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
                selectedVenue = findById(venues, selectedDropdownValue);
                return selectedVenue.screen_groups;
            case ('screen-group'):
                if (selectedVenue) {
                    selectedGroup = findById(selectedVenue.screen_groups, selectedDropdownValue);
                    return selectedGroup.screens;
                }
        }
    }

    function findById(items, itemId) {
        return items.find(item => item.id === itemId);
    }

    function performValuesLoading(destinationDropdown, valuesForDropdown) {
        destinationDropdown.empty();
        setDefaultEmptyValue(destinationDropdown);
        if (valuesForDropdown) {
            initSelector(destinationDropdown, valuesForDropdown);
        }
    }

    function saveSelectionInStorage() {
        let selectedSetting = {};
        selectedSetting.contentUrl = contentUrl;
        selectedSetting.selectedVenueId = selectedVenue.id;
        selectedSetting.selectedGroupId = selectedGroup.id;
        selectedSetting.selectedScreenId = selectedScreen.id;
        LocalStorageManager.putInStorage(StorageNames.SELECTED_SETTING_STORAGE, selectedSetting);
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
        values.forEach(value => {
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

function getFromStorage(key, callback) {
    if (!key) {
        return storage.getAll(callback);
    }
    return storage.get(key, callback);
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
    logLines.forEach((line) => {
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