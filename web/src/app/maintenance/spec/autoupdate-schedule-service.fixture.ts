import {KioskVersionDetails} from "../entities/kiosk-version-details";
import * as _ from 'lodash';
import {AutoupdateSchedule} from "../entities/autoupdate-schedule";

export class AutoupdateScheduleServiceFixture {

    static schedules(count: number): Array<AutoupdateSchedule> {
        return _.range(count).map((index) => {
            const schedule = new AutoupdateSchedule();
            schedule.id = index;
            schedule.isEnabled = false;

            return schedule;
        });
    }
}
