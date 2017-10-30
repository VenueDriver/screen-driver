import {AutoupdateSchedule} from "../autoupdate-schedule";

export class AutoUpdateScheduleFixture {
    static DEFAULT_ID = 'id';
    static DEFAULT_ENABLED_STATE = false;
    static DEFAULT_EVENT_TIME = '* * * * * *';

    static schedule(id: string = AutoUpdateScheduleFixture.DEFAULT_ID,
                    isEnabled: boolean = AutoUpdateScheduleFixture.DEFAULT_ENABLED_STATE,
                    eventTime: string = AutoUpdateScheduleFixture.DEFAULT_EVENT_TIME): AutoupdateSchedule {

        const schedule = new AutoupdateSchedule();

        schedule.id = id;
        schedule.isEnabled = isEnabled;
        schedule.eventTime = eventTime;

        return schedule;
    }
}