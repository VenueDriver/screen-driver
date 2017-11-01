/* tslint:disable:no-unused-variable */

import {AutoUpdateScheduleFixture} from "./auto-update-schedule.fixture";
import {AutoupdateSchedule} from "../autoupdate-schedule";

const defaultSchedule: AutoupdateSchedule = AutoUpdateScheduleFixture.schedule();

describe('AutoupdateSchedule', () => {

    describe('constructor()', () => {

        describe('when input schedule parameter is not presented', () => {
            let schedule = new AutoupdateSchedule();

            it('object should be initialized with default values', () => {
                expect(schedule.id).toBeUndefined();
                expect(schedule.isEnabled).toBeFalsy();
                expect(schedule.eventTime).toBeUndefined();
            });
        });

        describe('when input schedule parameter presents', () => {
            let schedule = new AutoupdateSchedule(defaultSchedule);

            it('object should be initialized with passed schedule', () => {
                expect(schedule.id).toBe(defaultSchedule.id);
                expect(schedule.isEnabled).toBe(defaultSchedule.isEnabled);
                expect(schedule.eventTime).toBe(defaultSchedule.eventTime);
            });
        });
    });
});
