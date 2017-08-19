'use strict';

module.exports = class ScheduleDataPreparationHelper {

    static createDefaultSchedule() {
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

    static createRepeatableSchedule() {
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

    static createScheduleWithoutSettingId() {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        delete schedule.settingId;
        return schedule;
    }

    static createScheduleWithEmptySettingId() {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        schedule.settingId = '';
        return schedule;
    }

    static createScheduleWithoutEventCron() {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        delete schedule.eventCron;
        return schedule;
    }

    static createScheduleWithEmptyEventCron() {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        schedule.eventCron = '';
        return schedule;
    }

    static createScheduleWithoutEndEventCron() {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        delete schedule.endEventCron;
        return schedule;
    }

    static createScheduleWithEmptyEndEventCron() {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        schedule.endEventCron = '';
        return schedule;
    }

    static createScheduleWithoutPeriodicity() {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        delete schedule.periodicity;
        return schedule;
    }

    static createScheduleWithoutRevisionNumber() {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        delete schedule._rev;
        return schedule;
    }
};