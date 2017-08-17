'use strict';

const cron = require('node-cron');

class CronValidator {

    static validate(cronExpression) {
        return cron.validate(cronExpression) &&
               CronValidator.validateSeconds(cronExpression) &&
               CronValidator.validateMinutes(cronExpression) &&
               CronValidator.validateHours(cronExpression)
    }

    static validateSeconds(cronExpression) {
        let cronParts = cronExpression.split(' ');
        return cronParts[0] === '0';
    }

    static validateMinutes(cronExpression) {
        let cronParts = cronExpression.split(' ');
        return Number.isInteger(+cronParts[1]);
    }

    static validateHours(cronExpression) {
        let cronParts = cronExpression.split(' ');
        return Number.isInteger(+cronParts[2]);
    }
}

module.exports = CronValidator;