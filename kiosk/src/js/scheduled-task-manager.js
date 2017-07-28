const CronJob = require('cron').CronJob;
const WindowInstanceHolder = require('./window-instance-holder');


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

    addCronSchedule(schedule, onEndCallback) {
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
                WindowInstanceHolder.getWindow().loadURL(schedule.content.url);
            }
        }

        function disableCron() {
            onEndCallback();
            activeSchedule = null;
        }
    }

    resetAllSchedules(schedules) {
        this.clearAllSchedules();
        schedules.forEach(schedule => this.addCronSchedule(schedule, temporaryEndFunction));
        
        function temporaryEndFunction() {
            console.log('Event was finished');
        }
    }

    clearAllSchedules() {
        this.scheduledCronJobs.forEach(schedule => {
            schedule.startScheduleCron.stop();
            schedule.endStartSchedule.stop();
        });
        this.scheduledCronJobs.pop();
        this.activeSchedule = null;
    }

}

module.exports = new ScheduledTaskManager();
