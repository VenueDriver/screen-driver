'use strict';

const log = require('electron-log');
const os = require('os');

const isDev = require('electron-is-dev');

const LOGS_FILE_NAME = 'error.log';

class Logger {

    static setupLoggerProperties() {
        log.transports.file.level = 'error';
        log.transports.file.maxSize = 10 * 1024 * 1024;

        let logsFilePath = Logger.getLogsFilePath();
        log.transports.file.file = `${logsFilePath}/${LOGS_FILE_NAME}`;
    }

    static getLogsFilePath() {
        if (isDev) {
            return `${__dirname}/..`;
        }
        return process.cwd();
    }

    static logGlobalError(data) {
        let fileName = data.url.substr(data.url.indexOf('app.asar'));
        fileName = fileName.replace('app.asar', '');
        let errorMessage = data.error.trim();
        Logger.error(`${errorMessage}, ${fileName}:${data.line}`);
    }

    static getLogsFileLocation() {
        let rootPath = Logger.getLogsFilePath();
        let separator = Logger.getPathSeparatorForPlatform();
        return `${rootPath}${separator}${LOGS_FILE_NAME}`;
    }

    static getPathSeparatorForPlatform() {
        let platform = os.platform();
        switch (platform) {
            case 'linux': return '/';
            case 'win32': return '\\';
        }
    }

    static error(message, error) {
        log.error(message, error);
    }

    static info(message) {
        log.info(message);
    }
}

module.exports = Logger;