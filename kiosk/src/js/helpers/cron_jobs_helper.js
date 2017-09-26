'use strict';

const CurrentScreenSettingsManager = require('./../current_screen_settings_manager');
const CronJob = require('cron').CronJob;
const Logger = require('./../logger/logger');
const _ = require('lodash');

class CronJobsManager {

    static initSettingsLoadJob() {
        let settingsLoadJob = new CronJob('*/5 * * * *', function () {
            try {
                CurrentScreenSettingsManager.changeScreenConfiguration();
            } catch (error) {
                Logger.error('Error occurred while performing CRON task:', error);
            }
        }, null, true, 'UTC');
        settingsLoadJob.start();
        return settingsLoadJob;
    }

    static stopJob(cronJob) {
        if (cronJob) {
            cronJob.stop();
        }
    }

}

module.exports = CronJobsManager;