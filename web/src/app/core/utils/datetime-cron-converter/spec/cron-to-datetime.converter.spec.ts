import {CronToDatetimeConverter} from "../cron-to-datetime.converter";

describe('CronToDatetimeConverter', () => {

    describe('getDateFromCron()', () => {
        describe('when input is 0 0 13 1 JAN * 2017', () => {
            it('should return January 1, 2017', () => {
                let result = CronToDatetimeConverter.getDateFromCron('0 0 13 1 JAN * 2017');
                expect(result).toEqual(new Date(2017, 0, 1));
            });
        });

        describe('when input is an empty string', () => {
            it('should return current date', () => {
                let result = CronToDatetimeConverter.getDateFromCron('');
                let currentDate = new Date();
                expect(result.getDay()).toBe(currentDate.getDay());
                expect(result.getMonth()).toBe(currentDate.getMonth());
                expect(result.getFullYear()).toBe(currentDate.getFullYear());
            });
        });
    });

    describe('getMinutesFromCron()', () => {
        describe('when input is 0 0 13 1 JAN * 2017', () => {
            it('should return 00', () => {
                let result = CronToDatetimeConverter.getMinutesFromCron('0 0 13 1 JAN * 2017');
                expect(result).toBe('00');
            });
        });

        describe('when input is 0 30 13 1 JAN * 2017', () => {
            it('should return 00', () => {
                let result = CronToDatetimeConverter.getMinutesFromCron('0 30 13 1 JAN * 2017');
                expect(result).toBe('30');
            });
        });

        describe('when input is 0 5 13 1 JAN * 2017', () => {
            it('should return 00', () => {
                let result = CronToDatetimeConverter.getMinutesFromCron('0 5 13 1 JAN * 2017');
                expect(result).toBe('05');
            });
        });

        describe('when input is an empty string', () => {
            it('should return an empty string', () => {
                let result = CronToDatetimeConverter.getMinutesFromCron('');
                expect(result).toBe('');
            });
        });
    });

    describe('getHoursFromCron()', () => {
        describe('when input is 0 0 13 1 JAN * 2017', () => {
            it('should return 13', () => {
                let result = CronToDatetimeConverter.getHoursFromCron('0 0 13 1 JAN * 2017');
                expect(result).toBe(13);
            });
        });

        describe('when input is an empty string', () => {
            it('should return 0', () => {
                let result = CronToDatetimeConverter.getHoursFromCron('');
                expect(result).toBe(0);
            });
        });
    });

    describe('getWeekDaysFromCron()', () => {
        describe('when input is * * * * * MON,TUE,THU,FRI', () => {
            it('should return MON,TUE,THU,FRI', () => {
                let result = CronToDatetimeConverter.getWeekDaysFromCron('* * * * * MON,TUE,THU,FRI');
                expect(result).toBe('MON,TUE,THU,FRI');
            });
        });

        describe('when input is * * * * * MON,TUE,WED 2017', () => {
            it('should return MON,TUE,WED', () => {
                let result = CronToDatetimeConverter.getWeekDaysFromCron('* * * * * MON,TUE,WED 2017');
                expect(result).toBe('MON,TUE,WED');
            });
        });

        describe('when input is an empty string', () => {
            it('should return an empty string', () => {
                let result = CronToDatetimeConverter.getWeekDaysFromCron('');
                expect(result).toBe('');
            });
        });
    });

});
