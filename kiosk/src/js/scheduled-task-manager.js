const cron = require('node-cron');
const ScheduleMergeTool = require('./schedule-merge-tool');
const CurrentScreenSettingsManager = require('./current_screen_settings_manager');
const SettingsHelper = require('./helpers/settings_helper');
const WindowInstanceHolder = require('./window-instance-holder');
const {LocalStorageManager, StorageNames} = require('./helpers/local_storage_helper');

const _ = require('lodash');

let instance = null;

const currentSchedule = {task: ''};

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
            if (!ScheduledTaskManager.isScheduled()) {
                currentSchedule.task = startScheduleCronJob;
                if (!_.isEmpty(composedSchedule.backgroundCron)) {
                    composedSchedule.backgroundCron.destroy();
                }
                ScheduledTaskManager.reloadWindow(schedule, schedule.content.url);
            } else if (_.isEmpty(composedSchedule.backgroundCron)) {
                composedSchedule.backgroundCron = cron.schedule('* * * * * *', () => runScheduledTask(), true);
            }
        }

        function disableCron() {
            ScheduledTaskManager.reloadWindow(schedule, schedule.defaultUrl);
            currentSchedule.task = {};
        }
    }

    static reloadWindow(schedule, url) {
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
            let enabledSchedules = _.filter(schedules, (s) => s.enabled);
            _.forEach(enabledSchedules, s => this.addCronSchedule(s));
        }
    }

    clearAllSchedules() {
        this.scheduledCronJobs.forEach(schedule => {
            schedule.startScheduleCron.destroy();
            schedule.endStartSchedule.destroy();
        });
        this.scheduledCronJobs.pop();
        currentSchedule.task = {};
    }

    initSchedulingForScreen(screenInformation) {
        LocalStorageManager.getFromStorage(StorageNames.SERVER_DATA_STORAGE, (error, serverData) => {
            let settingWithSchedules = ScheduleMergeTool.merge(serverData, screenInformation.selectedScreenId);

            _.forEach(settingWithSchedules.schedules, schedule => {
                let setting = serverData.originalSettings.find(setting => setting.id === schedule.settingId);
                let contentId = SettingsHelper.defineContentId(setting, screenInformation);
                schedule.content = serverData.content.find(content => content.id === contentId);
                schedule.defaultUrl = screenInformation.contentUrl;
            });
            this.resetAllSchedules(settingWithSchedules.schedules, serverData.originalSettings);
        })
    }

    static isScheduled() {
        return !_.isEmpty(currentSchedule.task);
    }
}

const scheduledTaskManager = new ScheduledTaskManager();

module.exports = {
    scheduledTaskManager: scheduledTaskManager,
    currentSchedule: currentSchedule
};
