const electron = require('electron');
const app = electron.app;
const ServerDataLoadJob = require('../../data/server_data_load_job');
const {scheduledTaskManager} = require('../../../scheduled_task_manager');
const WindowsHelper = require('../../browser-windows/windows_helper');


/**
 * Should be used after application's 'ready' event was triggered
 */

app.on('shortcut-pressed', (event) => {
    if (event === 'open-admin-panel') {
        ServerDataLoadJob.stopJob();
        scheduledTaskManager.clearAllSchedules();
        WindowsHelper.openAdminPanel();
    }
});
