'use strict';

const cron = require('node-cron');

class CronValidator {

    static validate(cronExpression) {
        return cron.validate(cronExpression);
    }
}

module.exports = CronValidator;