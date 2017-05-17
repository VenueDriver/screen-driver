const storage = require('electron-json-storage');
const {ipcRenderer} = require('electron');

window.$ = window.jQuery = require('jquery');

let screensConfig;
let jsyaml = require('js-yaml');

$(function () {
    loadScreensConfig();

    let selectedVenue;
    let selectedGroup;

    let selectedVenueName;
    let selectedScreenGroupName;
    let selectedScreenId;
    let contentUrl;

    putPreviouslySelectedDataIntoSelectors();
    verifySaveButtonState();

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
        selectedScreenId = $('#screen-id').find(":selected").text();

        if (selectedGroup) {
            contentUrl = selectedGroup[selectedScreenId];
        }

        verifySaveButtonState();
    });

    function verifySaveButtonState() {
        if (!contentUrl || selectedScreenId == 'Not selected') {
            disableSaveButton();
            return false;
        } else {
            enableSaveButton();
            return true;
        }
    }

    function putPreviouslySelectedDataIntoSelectors() {
        getFromStorage(null, function (error, data) {
            if (data.contentUrl) {
                $('#venue').val(data.selectedVenue).trigger("change");
                $('#screen-group').val(data.selectedGroup).trigger("change");
                $('#screen-id').val(data.selectedScreen).trigger("change");
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
                selectedVenueName = selectedDropdownValue;
                break;
            case ('screen-group'):
                if (selectedVenue) {
                    selectedItemValue = selectedVenue[selectedDropdownValue];
                    selectedGroup = selectedItemValue;
                    selectedScreenGroupName = selectedDropdownValue;
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
                destinationDropdown.append($('<option>', {
                    value: group,
                    text: group
                }));
            }
        }

    }

    function saveSelectionInStorage() {
        putInStorage('selectedVenue', selectedVenueName);
        putInStorage('selectedGroup', selectedScreenGroupName);
        putInStorage('selectedScreen', selectedScreenId);
        putInStorage('contentUrl', contentUrl);
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

function hideCancelButton() {
    $('#cancel').addClass('disabled');
}

function loadScreensConfig() {
    $.ajax({
        url: "https://raw.githubusercontent.com/VenueDriver/screen-driver/master/config/screenContent.yml",
        success: function (yaml) {
            screensConfig = jsyaml.load(yaml);
            initVenuesSelector();
        },
        error: function (error) {
            $("#config-load-error").text("Failed to load resource" + (error.responseText == "" ? '' : (':  ' + error.responseText)));
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