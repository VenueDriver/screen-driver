/* tslint:disable:no-unused-variable */


import {CronConvertStrategy, CustomCronParser} from "../custom-cron-parser";

describe('CustomCronParser', () => {
    const EVERY_DAY_AT_MIDNIGHT_CRON_EXPRESSION = '0 0 0 * * * *';
    const EVERY_DAY_AT_ONE_AM_CRON_EXPRESSION = '0 0 1 * * * *';
    const EVERY_DAY_AT_NOON_CRON_EXPRESSION = '0 0 12 * * * *';
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
                const EVERY_DAY_AT_ZERO_TWENTY_PM_CRON_EXPRESSION = '0 12 12 * * * *';
                const parser = new CustomCronParser(EVERY_DAY_AT_ZERO_TWENTY_PM_CRON_EXPRESSION, CronConvertStrategy.DEFAULT);
                expect(parser.getPeriod()).toBe('PM');
            });
        });

        describe('when cron is 0 12 0 * * * *', () => {
            it('should return PM', () => {
                const EVERY_DAY_AT_ZERO_TWENTY_AM_CRON_EXPRESSION = '0 12 0 * * * *';
                const parser = new CustomCronParser(EVERY_DAY_AT_ZERO_TWENTY_AM_CRON_EXPRESSION, CronConvertStrategy.DEFAULT);
                expect(parser.getPeriod()).toBe('AM');
            });
        });

        describe('when cron is 0 0 1 * * * *', () => {
            it('should return PM', () => {
                const parser = new CustomCronParser(EVERY_DAY_AT_ONE_AM_CRON_EXPRESSION, CronConvertStrategy.DEFAULT);
                expect(parser.getPeriod()).toBe('AM');
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

        describe('when cron is 0 30 13 * * * *', () => {
            it('should return 0', () => {
                const EVERY_DAY_AT_HALF_PAST_ONE_PM_CRON_EXPRESSION = '0 30 13 * * * *';
                const parser = new CustomCronParser(EVERY_DAY_AT_HALF_PAST_ONE_PM_CRON_EXPRESSION, CronConvertStrategy.DEFAULT);
                expect(parser.getMinutes()).toBe('30');
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

        describe('when cron is 0 0 0 * * * *', () => {
            it('should return 0', () => {
                const parser = new CustomCronParser(EVERY_DAY_AT_MIDNIGHT_CRON_EXPRESSION, CronConvertStrategy.DEFAULT);
                expect(parser.getHours()).toBe('0');
            });

            describe('when CronConvertStrategy is PERIOD_SENSITIVE', () => {
                it('should return 12', () => {
                    const parser = new CustomCronParser(EVERY_DAY_AT_MIDNIGHT_CRON_EXPRESSION, CronConvertStrategy.PERIOD_SENSITIVE);
                    expect(parser.getHours()).toBe('12');
                });
            });
        });

        describe('when cron is 0 0 12 * * * *', () => {
            it('should return 12', () => {
                const parser = new CustomCronParser(EVERY_DAY_AT_NOON_CRON_EXPRESSION, CronConvertStrategy.DEFAULT);
                expect(parser.getHours()).toBe('12');
            });

            describe('when CronConvertStrategy is PERIOD_SENSITIVE', () => {
                it('should return 12', () => {
                    const parser = new CustomCronParser(EVERY_DAY_AT_NOON_CRON_EXPRESSION, CronConvertStrategy.PERIOD_SENSITIVE);
                    expect(parser.getHours()).toBe('12');
                });
            });
        });

        describe('when cron is 0 0 1 * * * *', () => {
            it('should return 1', () => {
                const parser = new CustomCronParser(EVERY_DAY_AT_ONE_AM_CRON_EXPRESSION, CronConvertStrategy.DEFAULT);
                expect(parser.getHours()).toBe('1');
            });

            describe('when CronConvertStrategy is PERIOD_SENSITIVE', () => {
                it('should return 1', () => {
                    const parser = new CustomCronParser(EVERY_DAY_AT_ONE_AM_CRON_EXPRESSION, CronConvertStrategy.PERIOD_SENSITIVE);
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
            it('should return structure {hours: 13, minutes: 00, period: PM, time: 13:00}', () => {
                const parser = new CustomCronParser(EVERY_DAY_AT_ONE_PM_CRON_EXPRESSION, CronConvertStrategy.DEFAULT);
                const result = parser.result();
                expect(result.hours).toBe('13');
                expect(result.minutes).toBe('00');
                expect(result.period).toBe('PM');
                expect(result.time).toBe('13:00');
            });
        });
    });
});
