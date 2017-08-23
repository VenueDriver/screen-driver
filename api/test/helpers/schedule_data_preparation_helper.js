'use strict';

const uuid = require('uuid');

module.exports = class ScheduleDataPreparationHelper {

    static createDefaultOneTimeSchedule() {
        let defaultCronExpression = ScheduleDataPreparationHelper.getDefaultCronExpression();
        return {
            settingId: 'setting_id',
            eventCron: defaultCronExpression,
            endEventCron: defaultCronExpression,
            periodicity: 'ONE_TIME',
            _rev: 0
        };
    }

    static getDefaultCronExpression() {
        return '0 0 8 1 JUN * 2017';
    }

    static createDefaultRepeatableSchedule() {
        let defaultCronExpression = ScheduleDataPreparationHelper.getValidRepeatableCronExpression();
        return {
            settingId: 'setting_id',
            eventCron: defaultCronExpression,
            endEventCron: defaultCronExpression,
            periodicity: 'REPEATABLE',
            _rev: 0
        };
    }

    static getValidRepeatableCronExpression() {
        return '0 0 8 * * MON';
    }

    static createRepeatableSchedule(eventCron, endEventCron, settingId) {
        return {
            id: uuid.v1(),
            eventCron: eventCron,
            endEventCron: endEventCron,
            settingId: settingId,
            periodicity: 'REPEATABLE',
            _rev: 0
        };
    }

    static createOneTimeSchedule(eventCron, endEventCron, settingId) {
        return {
            id: uuid.v1(),
            eventCron: eventCron,
            endEventCron: endEventCron,
            settingId: settingId,
            periodicity: 'ONE_TIME',
            _rev: 0
        };
    }

    static createScheduleWithoutSettingId() {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        delete schedule.settingId;
        return schedule;
    }

    static createScheduleWithEmptySettingId() {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.settingId = '';
        return schedule;
    }

    static createScheduleWithoutEventCron() {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        delete schedule.eventCron;
        return schedule;
    }

    static createScheduleWithEmptyEventCron() {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.eventCron = '';
        return schedule;
    }

    static createScheduleWithoutEndEventCron() {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        delete schedule.endEventCron;
        return schedule;
    }

    static createScheduleWithEmptyEndEventCron() {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.endEventCron = '';
        return schedule;
    }

    static createScheduleWithoutPeriodicity() {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        delete schedule.periodicity;
        return schedule;
    }

    static createScheduleWithoutRevisionNumber() {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        delete schedule._rev;
        return schedule;
    }
};