var screensConfig;
var $ = require('jquery');
var jsyaml = require('js-yaml');

$(function () {
    $.ajax({
        url: "https://raw.githubusercontent.com/VenueDriver/screen-driver/master/config/screenContent.yml",
        success: function (yaml) {
            screensConfig = jsyaml.load(yaml);
        },
        error: function (error) {

        }
    });
});