window.nodeRequire = require;
delete window.require;
delete window.exports;
delete window.module;

var webFrame = nodeRequire('electron').webFrame;
webFrame.setZoomLevelLimits(1, 1);