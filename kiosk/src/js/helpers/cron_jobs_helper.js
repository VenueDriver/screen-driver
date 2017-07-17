'use strict';

const CurrentScreenSettingsManager = require('./../current_screen_settings_manager');
const CronJob = require('cron').CronJob;
const Logger = require('./../logger/logger');

class CronJobsManager {

    static initSettingsLoadJob(contentWindow) {
        let settingsLoadJob = new CronJob('*/5 * * * *', function() {
            CurrentScreenSettingsManager.getCurrentSetting()
                .then(setting => CurrentScreenSettingsManager.reloadCurrentScreenConfig(setting))
                .then(contentUrl => CronJobsManager.reloadWindowContent(contentWindow, contentUrl))
                .catch(error => Logger.error('Error occurred while performing CRON task:', error));
        }, null, true, 'UTC');
        settingsLoadJob.start();
        return settingsLoadJob;
    }

    static reloadWindowContent(contentWindow, contentUrl) {
        let currentUrl = CronJobsManager.cutSlashAtTheEnd(contentWindow.getURL());
        let newUrl = CronJobsManager.cutSlashAtTheEnd(contentUrl);
        if (currentUrl !== newUrl) {
            contentWindow.loadURL(newUrl);
        }
    }

    static cutSlashAtTheEnd(url) {
        return url.lastIndexOf('/') == url.length - 1 ? url.slice(0, -1) : url;
    }

    static stopJob(cronJob) {
        if (cronJob) {
            cronJob.stop();
        }
    }

}

module.exports = CronJobsManager;