const CronJob = require('cron').CronJob;
const ScheduleMergeTool = require('./schedule-merge-tool');
const CurrentScreenSettingsManager = require('./current_screen_settings_manager');
const WindowInstanceHolder = require('./window-instance-holder');
const {LocalStorageManager, StorageNames} = require('./helpers/local_storage_helper');

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
        let startScheduleCronJob = new CronJob(schedule.eventCron, runScheduledTask);
        let endScheduleCronJob = new CronJob(schedule.endEventCron, disableCron);
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
            schedule.startScheduleCron.stop();
            schedule.endStartSchedule.stop();
        });
        this.scheduledCronJobs.pop();
        this.activeSchedule = null;
    }

    initSchedulingForScreen(screenInformation) {
        LocalStorageManager.getFromStorage(StorageNames.SERVER_DATA, (error, serverData) => {
            let convertedSetting = CurrentScreenSettingsManager.convert(serverData, screenInformation);
            let settingWithSchedules = ScheduleMergeTool.merge(serverData, convertedSetting.selectedScreenId);
            settingWithSchedules.schedules.forEach(schedule => {
                let setting = serverData.originalSettings.find(setting => setting.id === schedule.settingId);
                let contentId = setting.config[convertedSetting.selectedScreenId];
                schedule.content = serverData.content.find(content => content.id === contentId);
                schedule.defaultUrl = screenInformation.contentUrl;
            });
            this.resetAllSchedules(settingWithSchedules.schedules, serverData.originalSettings);
        })
    }

}

module.exports = new ScheduledTaskManager();
