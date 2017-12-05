const Subject = require('rxjs').Subject;
const Logger = require('../logger/logger');

let instance = null;

class GlobalErrorsHandlingService {
    constructor() {
        if (!instance) {
            instance = this;
            this.errors = new Subject();
        }
        return instance;
    }

    registerError(error) {
        Logger.warn('Global errors handler registered an error: ' + error.message);
        Logger.warn(error.stack);
        this.errors.next(error);
    }

    getErrors() {
        return this.errors.asObservable();
    }

}

module.exports = new GlobalErrorsHandlingService();
