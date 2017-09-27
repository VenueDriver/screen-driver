const cron = require('node-cron');
const ScheduleMergeTool = require('./schedule-merge-tool');
const UserInteractionsManager = require('./user-interactions-manager');
const SettingsHelper = require('./helpers/settings_helper');
const WindowInstanceHolder = require('./window-instance-holder');
const StorageManager = require('./helpers/storage_manager');
const CronParser = require('./helpers/cron_parser');

const _ = require('lodash');

let instance = null;

class ScheduledTaskManager {
    constructor() {
        if (!instance) {
            instance = this;
            this.scheduledCronJobs = [];
        }
        return instance;
    }

    addCronSchedule(schedule) {
        let startScheduleCronJob = cron.schedule(schedule.eventCron, runScheduledTask, true);
        let endScheduleCronJob = cron.schedule(schedule.endEventCron, disableCron, true);
        let composedSchedule = {startScheduleCron: startScheduleCronJob, endStartSchedule: endScheduleCronJob, backgroundCron: {}};
        this.scheduledCronJobs.push(composedSchedule);
        startScheduleCronJob.start();
        endScheduleCronJob.start();
        if (ScheduledTaskManager.isScheduleShouldBeRunAlready(schedule)) {
            runScheduledTask();
        }

        function runScheduledTask() {
            if (!isScheduled() || ScheduledTaskManager._isScheduleMorePriority(schedule)) {
                ScheduledTaskManager._runScheduledTask(schedule, composedSchedule);
            }
            if (_.isEmpty(composedSchedule.backgroundCron)) {
                composedSchedule.backgroundCron = cron.schedule('* * * * * *', () => runScheduledTask(), true);
            }
        }

        function disableCron() {
            ScheduledTaskManager._destroyBackgroundTask(composedSchedule.backgroundCron);
            ScheduledTaskManager.reloadWindow(schedule.defaultUrl);
            StorageManager.saveScheduledTask({});
        }
    }

    static _isScheduleMorePriority(schedule) {
        let currentSchedule = StorageManager.getStorage().getScheduledTask();
        return schedule.periodicity === 'ONE_TIME' && currentSchedule.periodicity !== 'ONE_TIME';
    }

    static _saveTaskInStorage(schedule) {
        let currentSchedule = schedule;
        currentSchedule.startDateTime = new Date();
        currentSchedule.endDateTime = CronParser.parseEndEventCron(schedule);
        StorageManager.saveScheduledTask(currentSchedule);
    }

    static _runScheduledTask(schedule, composedSchedule) {
        UserInteractionsManager.applyWhenScreenNotInterruptedByUser(() => {
            ScheduledTaskManager._saveTaskInStorage(schedule);
            this._destroyBackgroundTask(composedSchedule.backgroundCron);
            ScheduledTaskManager.reloadWindow(schedule.content.url);
        })
    }

    static _destroyBackgroundTask(backgroundTask) {
        if (!_.isEmpty(backgroundTask)) {
            backgroundTask.destroy();
        }
        backgroundTask = {};
    }

    static reloadWindow(url) {
        let window = WindowInstanceHolder.getWindow();
        if (ScheduledTaskManager.isNeedToReload(window, url)) {
            window.loadURL(url);
        }
    }

    static isNeedToReload(window, url) {
        return window.webContents.getURL() !== url;
    }

    static isScheduleShouldBeRunAlready(schedule) {
        return this._isScheduleShouldRunAtThisTime(schedule) && this._isScheduleShouldRunToday(schedule);
    }

    static _isScheduleShouldRunAtThisTime(schedule) {
        let startDateTime = CronParser.parseStartEventCron(schedule);
        let endDateTime = CronParser.parseEndEventCron(schedule);
        let currentTime = new Date();

        return startDateTime < currentTime && currentTime < endDateTime;
    }

    static _isScheduleShouldRunToday(schedule) {
        let currentWeekdayNumber = new Date().getDay();
        if (schedule.periodicity === 'ONE_TIME') {
            return true;
        }
        return CronParser.convertWeekDaysToNumbers(schedule).indexOf(currentWeekdayNumber) !== -1;
    }

    resetAllSchedules(schedules) {
        this.clearAllSchedules();
        if (schedules) {
            _.forEach(schedules, s => this.addCronSchedule(s));
        }
    }

    clearAllSchedules() {
        this.scheduledCronJobs.forEach(schedule => {
            schedule.startScheduleCron.destroy();
            schedule.endStartSchedule.destroy();

            if (!_.isEmpty(schedule.backgroundCron)) {
                schedule.backgroundCron.destroy();
            }
        });
        this.scheduledCronJobs = [];
        StorageManager.saveScheduledTask({});
    }

    initSchedulingForScreen(screenInformation) {
        let serverData = StorageManager.getStorage().getServerData();
        let schedules = ScheduleMergeTool.merge(serverData, screenInformation);

        _.forEach(schedules, schedule => {
            this._appendContentToSchedule(schedule, screenInformation);
        });
        this.resetAllSchedules(schedules, serverData.originalSettings);
    }

    _appendContentToSchedule(schedule, screenInformation) {
        let contentId = this.defineContentId(schedule, screenInformation);
        if (!_.isEmpty(contentId)) {
            let serverData = StorageManager.getStorage().getServerData();
            schedule.content = _.find(serverData.content, content => content.id === contentId);
            schedule.defaultUrl = screenInformation.contentUrl;
        }
    }

    defineContentId(schedule, screenInformation) {
        let serverData = StorageManager.getStorage().getServerData();
        let setting = _.find(serverData.originalSettings, setting => setting.id === schedule.settingId);
        return SettingsHelper.defineContentId(setting, screenInformation);
    }

    resumeInterruptedScheduledTask() {
        let schedule = StorageManager.getStorage().getScheduledTask();
        let window = WindowInstanceHolder.getWindow();
        let scheduleEndTimeStamp = new Date(schedule.endDateTime).getTime();
        if (!_.isEmpty(schedule) && scheduleEndTimeStamp > new Date().getTime()) {
            window.loadURL(schedule.content.url);
        } else {
            StorageManager.saveScheduledTask({});
        }
    }
}

const scheduledTaskManager = new ScheduledTaskManager();
const isScheduled = () => !_.isEmpty(StorageManager.getStorage().getScheduledTask());

module.exports = {
    scheduledTaskManager: scheduledTaskManager,
    isScheduled: isScheduled
};
