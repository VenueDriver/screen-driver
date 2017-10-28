/* tslint:disable:no-unused-variable */


import {CronConvertStrategy, CustomCronParser} from "../custom-cron-parser";

describe('CustomCronParser', () => {
    const EVERY_DAY_AT_ONE_PM_CRON_EXPRESSION = '0 0 13 * * * *';

    describe('getPeriod()', () => {
        describe('when cron is 0 0 13 * * * *', () => {
            it('should return PM', () => {
                const parser = new CustomCronParser(EVERY_DAY_AT_ONE_PM_CRON_EXPRESSION, CronConvertStrategy.DEFAULT);
                expect(parser.getPeriod()).toBe('PM');
            });
        });

        describe('when cron is 0 12 12 * * * *', () => {
            it('should return PM', () => {
                const EVERY_DAY_AT_ZERO_TWENTY_PM_CRON_EXPRESSION = '0 12 00 * * * *';
                const parser = new CustomCronParser(EVERY_DAY_AT_ZERO_TWENTY_PM_CRON_EXPRESSION, CronConvertStrategy.DEFAULT);
                expect(parser.getPeriod()).toBe('AM');
            });
        });
    });

    describe('getPeriod()', () => {
        describe('when cron is 0 12 12 * * * *', () => {
            it('should return PM', () => {
                const EVERY_DAY_AT_TWENTY_TWENTY_PM_CRON_EXPRESSION = '0 12 12 * * * *';
                const parser = new CustomCronParser(EVERY_DAY_AT_TWENTY_TWENTY_PM_CRON_EXPRESSION, CronConvertStrategy.DEFAULT);
                expect(parser.getPeriod()).toBe('PM');
            });
        });
    });

    describe('getMinutes()', () => {
        describe('when cron is 0 0 13 * * * *', () => {
            it('should return 00', () => {
                const parser = new CustomCronParser(EVERY_DAY_AT_ONE_PM_CRON_EXPRESSION, CronConvertStrategy.DEFAULT);
                expect(parser.getMinutes()).toBe('00');
            });
        });
    });

    describe('getHours()', () => {
        describe('when cron is 0 0 13 * * * *', () => {
            it('should return 13', () => {
                const parser = new CustomCronParser(EVERY_DAY_AT_ONE_PM_CRON_EXPRESSION, CronConvertStrategy.DEFAULT);
                expect(parser.getHours()).toBe('13');
            });
            describe('when CronConvertStrategy is PERIOD_SENSITIVE', () => {
                it('should return 1', () => {
                    const parser = new CustomCronParser(EVERY_DAY_AT_ONE_PM_CRON_EXPRESSION, CronConvertStrategy.PERIOD_SENSITIVE);
                    expect(parser.getHours()).toBe('1');
                });
            });
        });
    });

    describe('getTime()', () => {
        describe('when cron is 0 0 13 * * * *', () => {
            it('should return 13:00', () => {
                const parser = new CustomCronParser(EVERY_DAY_AT_ONE_PM_CRON_EXPRESSION, CronConvertStrategy.DEFAULT);
                expect(parser.getTime()).toBe('13:00');
            });
        });
    });

    describe('result()', () => {
        describe('when cron is 0 0 13 * * * *', () => {
            it('should return structure {hours: 13, minutes: 00, period: PM}', () => {
                const parser = new CustomCronParser(EVERY_DAY_AT_ONE_PM_CRON_EXPRESSION, CronConvertStrategy.DEFAULT);
                const result = parser.result();
                expect(result.hours).toBe('13');
                expect(result.minutes).toBe('00');
                expect(result.period).toBe('PM');
            });
        });
    });
});
