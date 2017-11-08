import {DatetimeToCronConverter} from "../datetime-cron.converter";

describe('DatetimeToCronConverter', () => {

    describe('createCronForSpecificDate()', () => {

        describe('when input is Oct 27, 2017', () => {
            it('should return 0 0 0 27 OCT * 2017', () => {
                let result = DatetimeToCronConverter.createCronForSpecificDate(new Date('Oct 27, 2017'));
                expect(result).toBe('0 0 0 27 OCT * 2017');
            });
        });

    });

    describe('createCronForWeekDays()', () => {

        describe('when input is WED', () => {
            it('should return * * * * * WED', () => {
                let result = DatetimeToCronConverter.createCronForWeekDays('WED');
                expect(result).toBe('* * * * * WED');
            });
        });

        describe('when input is SUN,MON', () => {
            it('should return * * * * * SUN,MON', () => {
                let result = DatetimeToCronConverter.createCronForWeekDays('SUN,MON');
                expect(result).toBe('* * * * * SUN,MON');
            });
        });

        describe('when input is SUN,MON,TUE,WED,THU,FRI,SAT', () => {
            it('should return * * * * * SUN,MON,TUE,WED,THU,FRI,SAT', () => {
                let result = DatetimeToCronConverter.createCronForWeekDays('SUN,MON,TUE,WED,THU,FRI,SAT');
                expect(result).toBe('* * * * * SUN,MON,TUE,WED,THU,FRI,SAT');
            });
        });

        describe('when input is MON,TUE,THU,FRI', () => {
            it('should return * * * * * MON,TUE,THU,FRI', () => {
                let result = DatetimeToCronConverter.createCronForWeekDays('MON,TUE,THU,FRI');
                expect(result).toBe('* * * * * MON,TUE,THU,FRI');
            });
        });

        describe('when input is MON,TUE,WD', () => {
            it('should throw an error', () => {
                expect(DatetimeToCronConverter.createCronForWeekDays.bind('MON,TUE,WD')).toThrowError();
            });
        });

        describe('when input is MON.TUE.WED', () => {
            it('should throw an error', () => {
                expect(DatetimeToCronConverter.createCronForWeekDays.bind('MON.TUE.WED')).toThrowError();
            });
        });

    });

    describe('setTimeForCron()', () => {

        describe('when input is \'0 0 0 27 OCT * 2017\', 12, 20', () => {
            it('should return 0 20 12 27 OCT * 2017', () => {
                let result = DatetimeToCronConverter.setTimeForCron('0 0 0 27 OCT * 2017', 12, 20);
                expect(result).toBe('0 20 12 27 OCT * 2017');
            });
        });

        describe('when input is \'0 0 0 27 OCT * 2017\', 24, 20', () => {
            it('should return 0 20 0 27 OCT * 2017', () => {
                let result = DatetimeToCronConverter.setTimeForCron('0 0 0 27 OCT * 2017', 24, 20);
                expect(result).toBe('0 20 0 27 OCT * 2017');
            });
        });

        describe('when input is \'0 0 0 27 OCT * 2017\', 9, 120', () => {
            it('should return 0 0 11 27 OCT * 2017', () => {
                let result = DatetimeToCronConverter.setTimeForCron('0 0 0 27 OCT * 2017', 9, 120);
                expect(result).toBe('0 0 11 27 OCT * 2017');
            });
        });

    });

});
