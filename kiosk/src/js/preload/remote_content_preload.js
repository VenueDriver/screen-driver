const {ipcRenderer} = require('electron');

turnOnLogging();
renameExtraSymbols();
disableZoom();

var scrollCounter = 0;

window.onclick = function () {
    sendUserActionEvent();
};

window.onscroll = function () {
    if (scrollCounter % 10 == 0) {
        sendUserActionEvent();
    }
    scrollCounter++;
};

function sendUserActionEvent() {
    ipcRenderer.send('user-interacted', new Date());
}

function renameExtraSymbols() {
    window.nodeRequire = require;
    delete window.require;
    delete window.exports;
    delete window.module;
}

function disableZoom() {
    let webFrame = nodeRequire('electron').webFrame;
    webFrame.setZoomLevelLimits(1, 1);
}

function turnOnLogging() {
    window.onerror = function(error, url, line) {
        ipcRenderer.send('errorInWindow', {error: error, url: url, line: line});
    };
}

