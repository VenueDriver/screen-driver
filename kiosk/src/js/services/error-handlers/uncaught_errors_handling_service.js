const GlobalErrorsHandlingService = require('./global_errors_handling_service');
const Logger = require('../logger/logger');

process.on('uncaughtException', function (error) {
    UncaughtErrorsHandlingService.registerError(error);
});

class UncaughtErrorsHandlingService {
    static registerError(error) {
        Logger.error(error);
        GlobalErrorsHandlingService.registerError(error);
    }
}

module.exports = UncaughtErrorsHandlingService;
