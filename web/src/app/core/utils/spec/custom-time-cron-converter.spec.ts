/* tslint:disable:no-unused-variable */


import {CustomTimeCronConverter} from "../custom-time-cron-converter";
import {CronParseResult} from "../custom-cron-parser";

describe('CustomTimeCronConverter', () => {

    describe('cron()', () => {
        describe('when input is {hours: 1, minutes: 14, period: PM}', () => {
            it('should return 0 0 13 14 * * *', () => {
                const input: CronParseResult = {time: '13:14', hours: '13', minutes: '14', period: 'PM'};
                const converter = new CustomTimeCronConverter(input);

                expect(converter.cron).toBe('0 0 13 14 * * *');
            });
        });

        describe('when input is {hours: 1, minutes: 14, period: AM}', () => {
            it('should return 0 0 1 14 * * *', () => {
                const input: CronParseResult = {time: '01:14',hours: '1', minutes: '14', period: 'AM'};
                const converter = new CustomTimeCronConverter(input);

                expect(converter.cron).toBe('0 0 1 14 * * *');
            });
        });
    });
});
