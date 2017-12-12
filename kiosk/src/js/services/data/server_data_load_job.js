'use strict';

const CurrentScreenSettingsManager = require('../../current_screen_settings_manager');
const CronJob = require('cron').CronJob;
const Logger = require('../logger/logger');
const _ = require('lodash');

let settingsLoadJob;

class ServerDataLoadJob {

    static startJob() {
        ServerDataLoadJob.stopJob();
        settingsLoadJob = new CronJob('*/5 * * * *', function () {
            try {
                CurrentScreenSettingsManager.changeScreenConfiguration();
            } catch (error) {
                Logger.error('Error occurred while performing CRON task:', error);
            }
        }, null, true, 'UTC');
        settingsLoadJob.start();
    }

    static stopJob() {
        if (settingsLoadJob) {
            settingsLoadJob.stop();
        }
    }

}

module.exports = ServerDataLoadJob;