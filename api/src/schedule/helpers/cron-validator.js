'use strict';

const cron = require('node-cron');
const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

class CronValidator {

    static validate(cronExpression, periodicity) {
        return cron.validate(cronExpression) &&
               CronValidator.validateSeconds(cronExpression) &&
               CronValidator.validateMinutes(cronExpression) &&
               CronValidator.validateHours(cronExpression) &&
               CronValidator.validateCronForOneTimeSchedule(cronExpression, periodicity) &&
               CronValidator.validateCronForRepeatableSchedule(cronExpression, periodicity)
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

    static validateCronForOneTimeSchedule(cronExpression, periodicity) {
        if (periodicity !== 'ONE_TIME') return true;

        let cronParts = cronExpression.split(' ');
        return cronParts.length === 7 &&
               Number.isInteger(+cronParts[3]) &&
               MONTHS.includes(cronParts[4]) &&
               Number.isInteger(+cronParts[6]);
    }

    static validateCronForRepeatableSchedule(cronExpression, periodicity) {
        if (periodicity !== 'REPEATABLE') return true;

        let cronParts = cronExpression.split(' ');
        let weekDays = cronParts[5].split(',');
        return cronParts.length === 6 &&
               cronParts[3] === '*' &&
               cronParts[4] === '*' &&
               WEEK_DAYS.includes(weekDays[0]);
    }
}

module.exports = CronValidator;