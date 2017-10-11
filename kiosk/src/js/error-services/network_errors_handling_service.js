const Subject = require('rxjs').Subject;
const GlobalErrorsHandlingService = require('./global_errors_handling_service');
const Logger = require('./../logger/logger');

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
                Logger.warn('Connection error handled', error);
                this._registerError(error);
            }
        });
    }

    _isConnectionError(error) {
        return error.message.includes('net::ERR_CONNECTION_RESET');
    }

    _registerError(error) {
        this.errors.next(error);
    }

    getErrors() {
        return this.errors.asObservable();
    }

}

module.exports = new NetworkErrorsHandlingService();
