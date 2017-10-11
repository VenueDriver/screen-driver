const Subject = require('rxjs').Subject;

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
        this.errors.next(error);
    }

    getErrors() {
        return this.errors.asObservable();
    }

}

module.exports = new GlobalErrorsHandlingService();
