import {EventDateUtils} from "../event-date.utils";

describe('EventDateUtils', () => {

    describe('getTomorrowDate()', () => {

        let result = EventDateUtils.getTomorrowDate();

        it('should return tomorrow date', () => {
            let today = new Date();

            expect(result.getFullYear()).toBe(today.getFullYear());
            expect(result.getMonth()).toBe(today.getMonth());
            expect(result.getDate()).toBe(today.getDate() + 1);
        });

    });

    describe('convertTimeToDate()', () => {

        describe('when input is 8:00 AM', () => {
            let result = EventDateUtils.convertTimeToDate('8:00', 'AM');

            it('should return date for January 1, 2000 with time 8:00', () => {
                expect(result.getFullYear()).toBe(2000);
                expect(result.getMonth()).toBe(0);
                expect(result.getDate()).toBe(1);
                expect(result.getHours()).toBe(8);
                expect(result.getMinutes()).toBe(0);
            });

        });

        describe('when input is 8:00 PM', () => {
            let result = EventDateUtils.convertTimeToDate('8:00', 'PM');

            it('should return date for January 1, 2000 with time 20:00', () => {
                expect(result.getFullYear()).toBe(2000);
                expect(result.getMonth()).toBe(0);
                expect(result.getDate()).toBe(1);
                expect(result.getHours()).toBe(20);
                expect(result.getMinutes()).toBe(0);
            });

        });

        describe('when input is 12:30 AM', () => {
            let result = EventDateUtils.convertTimeToDate('12:30', 'AM');

            it('should return date for January 1, 2000 with time 0:30', () => {
                expect(result.getFullYear()).toBe(2000);
                expect(result.getMonth()).toBe(0);
                expect(result.getDate()).toBe(1);
                expect(result.getHours()).toBe(0);
                expect(result.getMinutes()).toBe(30);
            });

        });

        describe('when input is 8:00 PM and date', () => {
           let date = new Date();
           let result = EventDateUtils.convertTimeToDate('8:00', 'PM', date);

           it('should return the date with time 20:00', () => {
               expect(result.getFullYear()).toBe(date.getFullYear());
               expect(result.getMonth()).toBe(date.getMonth());
               expect(result.getDate()).toBe(date.getDate());
               expect(result.getHours()).toBe(20);
               expect(result.getMinutes()).toBe(0);
           });
           
        });

    });

    describe('getHours()', () => {

        describe('when input is 12:00 AM', () => {
            let result = EventDateUtils.getHours('12:00', 'AM');

            it('should return 0', () => {
                expect(result).toBe(0);
            });

        });

        describe('when input is 12:00 PM', () => {
            let result = EventDateUtils.getHours('12:00', 'PM');

            it('should return 12', () => {
                expect(result).toBe(12);
            });

        });

        describe('when input is 1:00 AM', () => {
            let result = EventDateUtils.getHours('1:00', 'AM');

            it('should return 1', () => {
                expect(result).toBe(1);
            });

        });

        describe('when input is 1:00 PM', () => {
            let result = EventDateUtils.getHours('1:00', 'PM');

            it('should return 13', () => {
                expect(result).toBe(13);
            });

        });

    });

});
