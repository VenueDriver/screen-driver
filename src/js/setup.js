var screensConfig;
window.$ = window.jQuery = require('jquery');
var jsyaml = require('js-yaml');

$(function () {
    $.ajax({
        url: "https://raw.githubusercontent.com/VenueDriver/screen-driver/master/config/screenContent.yml",
        success: function (yaml) {
            screensConfig = jsyaml.load(yaml);
            // initVenuesSelector();
        },
        error: function (error) {
            $("#config-load-error").text("Failed to load resource" + (error.responseText == "" ? '' : (':  ' + error.responseText)));
        }
    });
});