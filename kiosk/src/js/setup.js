const storage = require('electron-json-storage');
const {ipcRenderer} = require('electron');
const fs = require('fs');
const os = require('os');
const isDev = require('electron-is-dev');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(__dirname + '/../config/app.properties');

window.$ = window.jQuery = require('jquery');

let screensConfig;
let ConfigConverter = require('./js/config_converter');

$(function () {
    readLog();
    turnOnLogging();
    loadScreensConfig();

    let selectedVenue;
    let selectedGroup;

    let selectedVenueObject;
    let selectedScreenGroupObject;
    let selectedScreenObject;
    let selectedScreenName;
    let contentUrl;

    verifySaveButtonState();
    verifyCancelButtonState();

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
        selectedScreenName = $('#screen-id').find(":selected").text();

        if (selectedGroup) {
            if (selectedGroup[selectedScreenName]) {
                contentUrl = selectedGroup[selectedScreenName].url;
                selectedScreenObject = {name: selectedScreenName, id: selectedGroup[selectedScreenName]._id};
            } else {
                contentUrl = selectedGroup[selectedScreenName];
            }

        }

        verifySaveButtonState();
    });

    function verifySaveButtonState() {
        if (!contentUrl || selectedScreenName == 'Not selected') {
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
        let selectedDropdownValue = sourceDropdown.find(":selected").text();
        let selectedItemValue;

        switch (sourceDropdown.attr('id')) {
            case ('venue'):
                selectedItemValue = screensConfig[selectedDropdownValue];
                selectedVenue = selectedItemValue;
                selectedVenueObject = selectedItemValue ? {name: selectedDropdownValue, id: selectedVenue._id} : selectedItemValue;
                break;
            case ('screen-group'):
                if (selectedVenue) {
                    selectedItemValue = selectedVenue[selectedDropdownValue];
                    selectedGroup = selectedItemValue;
                    selectedScreenGroupObject = selectedItemValue ? {name: selectedDropdownValue, id: selectedItemValue._id} : selectedItemValue;
                }
                break;
        }

        destinationDropdown.empty();

        setDefaultEmptyValue(destinationDropdown);
        if (selectedItemValue) {
            setData();
        }

        //we need it to make re-rendering, because material design should re-render this component
        destinationDropdown.selectpicker('refresh');

        function setData() {
            for (let group in selectedItemValue) {
                if (group !== '_id') {
                    destinationDropdown.append($('<option>', {
                        value: group,
                        text: group
                    }));
                }
            }
        }

    }

    function saveSelectionInStorage() {
        putInStorage('selectedVenue', selectedVenueObject);
        putInStorage('selectedGroup', selectedScreenGroupObject);
        putInStorage('selectedScreen', selectedScreenObject);
        putInStorage('contentUrl', contentUrl);
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
    })
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

function loadScreensConfig() {
    let url = properties.get('ScreenDriver.content.url');
    $.ajax({
        url: url,
        success: function (json) {
            try {
                screensConfig = ConfigConverter.convert(json);
            } catch (error) {
                showError("Cannot read config: " + error.message);
                throw new Error(error.message);
            }
            initVenuesSelector();
            putPreviouslySelectedDataIntoSelectors();
        },
        error: function (error) {
            showError("Failed to load config" + (!error.responseText ? '' : (':  ' + error.responseText)));
            throw new Error(error.responseText);
        }
    });
}

function showError(errorMessage) {
    $("#config-load-error").text(errorMessage);
}

function putPreviouslySelectedDataIntoSelectors() {
    getFromStorage(null, function (error, data) {
        if (data.contentUrl) {
            $('#venue').val(data.selectedVenue.name).trigger("change");
            $('#screen-group').val(data.selectedGroup.name).trigger("change");
            $('#screen-id').val(data.selectedScreen.name).trigger("change");
        }
    });
}

function initVenuesSelector() {
    for (let venue in screensConfig) {
        $("#venue").append($('<option>', {
            value: venue,
            text: venue
        }));
    }
    $("#venue").selectpicker('refresh');
}

function putInStorage(key, value) {
    storage.set(key, value, function(error) {
        if (error) throw error;
    });
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