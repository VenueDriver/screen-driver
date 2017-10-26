export class AutoupdateSchedule {
    id: string;
    isEnabled: boolean = false;
    eventTime: string;
    _rev: number;

    constructor(schedule: AutoupdateSchedule) {
        if (schedule) {
            this.id = schedule.id;
            this.isEnabled = schedule.isEnabled;
            this.eventTime = schedule.eventTime;
            this._rev = schedule._rev;
        }
    }
}
