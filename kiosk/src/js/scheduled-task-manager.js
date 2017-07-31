const cron = require('node-cron');
const ScheduleMergeTool = require('./schedule-merge-tool');
const CurrentScreenSettingsManager = require('./current_screen_settings_manager');
const SettingsHelper = require('./helpers/settings_helper');
const WindowInstanceHolder = require('./window-instance-holder');
const {LocalStorageManager, StorageNames} = require('./helpers/local_storage_helper');

const _ = require('lodash');

let instance = null;

class ScheduledTaskManager {
    constructor() {
        if (!instance) {
            instance = this;
            this.scheduledCronJobs = [];
            this.activeSchedule = null;
        }
        return instance;
    }

    addCronSchedule(schedule) {
        let startScheduleCronJob = cron.schedule(schedule.eventCron, runScheduledTask, true);
        let endScheduleCronJob = cron.schedule(schedule.endEventCron, disableCron, true);
        let composedSchedule = {startScheduleCron: startScheduleCronJob, endStartSchedule: endScheduleCronJob};
        this.scheduledCronJobs.push(composedSchedule);
        startScheduleCronJob.start();
        endScheduleCronJob.start();
        let activeSchedule = this.activeSchedule;

        function runScheduledTask() {
            if (!activeSchedule) {
                activeSchedule = composedSchedule;
                ScheduledTaskManager.reloadWindow(schedule, schedule.content.url);
            }
        }

        function disableCron() {
            ScheduledTaskManager.reloadWindow(schedule, schedule.defaultUrl);
            activeSchedule = null;
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
        schedules.forEach(schedule => this.addCronSchedule(schedule));
    }

    clearAllSchedules() {
        this.scheduledCronJobs.forEach(schedule => {
            schedule.startScheduleCron.destroy();
            schedule.endStartSchedule.destroy();
        });
        this.scheduledCronJobs.pop();
        this.activeSchedule = null;
    }

    initSchedulingForScreen(screenInformation) {
        LocalStorageManager.getFromStorage(StorageNames.SERVER_DATA, (error, serverData) => {
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

}

module.exports = new ScheduledTaskManager();
