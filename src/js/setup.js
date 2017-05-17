var screensConfig;
window.$ = window.jQuery = require('jquery');
var jsyaml = require('js-yaml');
const storage = require('electron-json-storage');


$(function () {
    loadScreensConfig();

    var selectedVenue;
    var selectedGroup;

    var selectedVenueName;
    var selectedScreenGroupName;
    var selectedScreenId;
    var contentUrl;

    putPreviouslySelectedDataIntoDropdowns();
    verifySaveButtonState();

    $("#save").click(function () {
        if (verifySaveButtonState()) {
            putInStorage('selectedVenue', selectedVenueName);
            putInStorage('selectedGroup', selectedScreenGroupName);
            putInStorage('selectedScreen', selectedScreenId);
            putInStorage('contentUrl', contentUrl);
        }
    });

    $("#venue").change(function () {
        loadValues($(this), $('#screen-group'));
        clearLastDropdown();

        function clearLastDropdown() {
            // TODO: maybe we can do it in better way (e.g. trigger event select option)
            var screenIdDropdown = $("#screen-id");
            screenIdDropdown.empty();
            setDefaultEmptyValue(screenIdDropdown);
            screenIdDropdown.selectpicker('refresh');
        }
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
        if (!contentUrl) {
            disableSaveButton();
            return false;
        } else {
            enableSaveButton();
            return true;
        }
    }

    function putPreviouslySelectedDataIntoDropdowns() {
        getFromStorage(null, function (error, data) {
            if (data.contentUrl) {
                $('#venue option[value="' + data.selectedVenue + '"]').attr('selected', 'selected').trigger("change");
                $('#screen-group option[value="' + data.selectedGroup + '"]').attr('selected', 'selected').trigger("change");
                $('#screen-id option[value="' + data.selectedScreen + '"]').attr('selected', 'selected').trigger("change");
            }
        });
    }


    function loadValues(sourceDropdown, destinationDropdown) {
        var selectedDropdownValue = sourceDropdown.find(":selected").text();
        var selectedItemValue;

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
            for (var group in selectedItemValue) {
                destinationDropdown.append($('<option>', {
                    value: group,
                    text: group
                }));
            }
        }

    }

    function setDefaultEmptyValue(dropdown) {
        dropdown.append($('<option>', {
            value: 'none',
            text: 'Not selected'
        }));
        dropdown.trigger("change");
    }
});



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

        }
    });
}

function initVenuesSelector() {
    for (var venue in screensConfig) {
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

    if (!callback) {
        var result;
        storage.get(key, function(error, data) {
            if (error) throw error;

            result = data;
        });
        return result;
    }

    return storage.get(key, function(error, data) {
        if (error) throw error;
        return data;
    });
}