const electron = require('electron');
const app = electron.app;
const CronJobsManager = require('../../../helpers/settings_load_job_manager');
const {scheduledTaskManager} = require('../../../scheduled_task_manager');
const WindowsHelper = require('../../windows/windows_helper');


/**
 * Should be used after application's 'ready' event was triggered
 */

app.on('shortcut-pressed', (event) => {
    if (event === 'open-admin-panel') {
        CronJobsManager.stopJob();
        scheduledTaskManager.clearAllSchedules();
        WindowsHelper.openAdminPanel();
    }
});
