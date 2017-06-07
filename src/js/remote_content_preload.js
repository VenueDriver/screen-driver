turnOnLogging();
renameExtraSymbols();
disableZoom();

function renameExtraSymbols() {
    window.nodeRequire = require;
    delete window.require;
    delete window.exports;
    delete window.module;
}

function disableZoom() {
    var webFrame = nodeRequire('electron').webFrame;
    webFrame.setZoomLevelLimits(1, 1);
}

function turnOnLogging() {
    window.onerror = function(error, url, line) {
        ipcRenderer.send('errorInWindow', {error: error, url: url, line: line});
    };
}

