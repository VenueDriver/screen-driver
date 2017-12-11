const Subject = require('rxjs').Subject;
const GlobalErrorsHandlingService = require('./global_errors_handling_service');
const Logger = require('../logger/logger');

let instance = null;

class NetworkErrorsHandlingService {
    constructor() {
        if (!instance) {
            instance = this;
            this._subscribeToErrors();
            this.errors = new Subject();
        }
        return instance;
    }

    _subscribeToErrors() {
        GlobalErrorsHandlingService.getErrors().subscribe(error => {
            if (this._isConnectionError(error)) {
                this._registerError(error);
            }
        });
    }

    _isConnectionError(error) {
        return error.message.includes('net::ERR');
    }

    _registerError(error) {
        Logger.warn('Network errors handler registered an error: ' + error.message);
        this.errors.next(error);
    }

    getErrors() {
        return this.errors.asObservable();
    }

}

module.exports = new NetworkErrorsHandlingService();
