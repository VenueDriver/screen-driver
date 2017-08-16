const cron = require('node-cron');
const ScheduleMergeTool = require('./schedule-merge-tool');
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

        function runScheduledTask() {
            if (!isScheduled()) {
                ScheduledTaskManager._saveTaskInStorage(schedule);
                if (!_.isEmpty(composedSchedule.backgroundCron)) {
                    composedSchedule.backgroundCron.destroy();
                }
                ScheduledTaskManager.reloadWindow(schedule.content.url);
            } else if (_.isEmpty(composedSchedule.backgroundCron)) {
                composedSchedule.backgroundCron = cron.schedule('* * * * * *', () => runScheduledTask(), true);
            }
        }

        function disableCron() {
            ScheduledTaskManager.reloadWindow(schedule.defaultUrl);
            StorageManager.saveScheduledTask({});
        }
    }

    static _saveTaskInStorage(schedule) {
        let currentSchedule = schedule;
        currentSchedule.startDateTime = new Date();
        currentSchedule.endDateTime = CronParser.parseEndEventCron(schedule);
        StorageManager.saveScheduledTask(currentSchedule);
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

    resetAllSchedules(schedules) {
        this.clearAllSchedules();
        if (schedules) {
            let enabledSchedules = _.filter(schedules, (s) => s.enabled && s.content);
            _.forEach(enabledSchedules, s => this.addCronSchedule(s));
        }
    }

    clearAllSchedules() {
        this.scheduledCronJobs.forEach(schedule => {
            schedule.startScheduleCron.destroy();
            schedule.endStartSchedule.destroy();
        });
        this.scheduledCronJobs.pop();
    }

    initSchedulingForScreen(screenInformation) {
        let serverData = StorageManager.getStorage().getServerData();
        let settingWithSchedules = ScheduleMergeTool.merge(serverData, screenInformation);

        _.forEach(settingWithSchedules.schedules, schedule => {
            this._appendContentToSchedule(schedule, screenInformation);
        });

        this.resetAllSchedules(settingWithSchedules.schedules, serverData.originalSettings);
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
        if (!_.isEmpty(schedule)) {
            window.loadURL(schedule.content.url);
        }
    }
}

const scheduledTaskManager = new ScheduledTaskManager();
const isScheduled = () => !_.isEmpty(StorageManager.getStorage().getScheduledTask());

module.exports = {
    scheduledTaskManager: scheduledTaskManager,
    isScheduled: isScheduled
};
