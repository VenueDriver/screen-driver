var screensConfig;
var $ = require('jQuery');

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
    })
    console.log(screensConfig)
})