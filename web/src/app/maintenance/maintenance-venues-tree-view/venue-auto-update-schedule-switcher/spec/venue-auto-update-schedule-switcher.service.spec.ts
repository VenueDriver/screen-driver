/* tslint:disable:no-unused-variable */


import {VenueAutoUpdateScheduleSwitcherService} from "../venue-auto-update-schedule-switcher.service";

/**
 * Service is created without DI because it has not dependencies,
 * to see how to initialize service with dep @see https://angular.io/guide/testing
 */
describe('VenueAutoUpdateScheduleSwitcherService', () => {
    const EVERY_DAY_AT_ONE_PM_CRON_EXPRESSION = '0 0 13 * * * *';
    const EVERY_DAY_AT_TWENTY_TWENTY_AM_CRON_EXPRESSION = '0 12 24 * * * *';

    describe('getTimeFromCron()', () => {
        describe('when cron is 0 0 13 * * * *', () => {
            it('should return {hours: 13, minutes: 00, period: PM, time: 13:00}', () => {
                const service = new VenueAutoUpdateScheduleSwitcherService();
                const result = service.getTimeFromCron(EVERY_DAY_AT_ONE_PM_CRON_EXPRESSION);
                expect(result.period).toBe('PM');
                expect(result.hours).toBe('1');
                expect(result.minutes).toBe('00');
                expect(result.time).toBe('1:00');
            });
        });

        describe('when cron is 0 12 24 * * * *', () => {
            it('should return {hours: 12, minutes: 12, period: AM, time: 12:12}', () => {
                const service = new VenueAutoUpdateScheduleSwitcherService();
                const result = service.getTimeFromCron(EVERY_DAY_AT_TWENTY_TWENTY_AM_CRON_EXPRESSION);
                expect(result.period).toBe('AM');
                expect(result.hours).toBe('12');
                expect(result.minutes).toBe('12');
                expect(result.time).toBe('12:12');
            });
        });
    });

    describe('getDefaultAutoUpdateTime()', () => {
        it('should return {time: \'08:00\', hours: \'8\', minutes: \'00\', period: \'AM\'}', () => {
            const service = new VenueAutoUpdateScheduleSwitcherService();
            const result = service.getDefaultAutoUpdateTime();
            expect(result.period).toBe('AM');
            expect(result.hours).toBe('8');
            expect(result.minutes).toBe('00');
            expect(result.time).toBe('08:00');
        });
    });
});
