/* tslint:disable:no-unused-variable */

import {DateFormatterPipe} from "./date-formatter.pipe";


fdescribe('DateFormatterPipe', () => {

    describe('transform using original timezone', () => {

        describe('transform UTC-string date', () => {

            describe('when original time in GMT', () => {
                let formattedDate = new DateFormatterPipe().transform('Wed, 15 Nov 2017 17:00:00 GMT', 0);

                it('Should return the same value in 12hours format', () => {
                    expect(formattedDate).toBe('Nov 15, 2017 at 05:00 PM')
                });
            });

            describe('when original time in GMT +1', () => {
                let formattedDate = new DateFormatterPipe().transform('Wed, 15 Nov 2017 17:00:00 GMT', 1);

                it('Should add 1 hour', () => {
                    expect(formattedDate).toBe('Nov 15, 2017 at 06:00 PM')
                });
            });

            describe('when original time in GMT +2', () => {
                let formattedDate = new DateFormatterPipe().transform('Wed, 15 Nov 2017 17:00:00 GMT', 2);

                it('Should add 2 hours', () => {
                    expect(formattedDate).toBe('Nov 15, 2017 at 07:00 PM')
                });
            });

            describe('when utc time in previous day, but original time in next day', () => {
                let formattedDate = new DateFormatterPipe().transform('Wed, 15 Nov 2017 23:00:00 GMT', 2);

                it('should add 2 hours and increase the day', () => {
                    expect(formattedDate).toBe('Nov 16, 2017 at 01:00 AM')
                });
            });

            describe('when utc time in next day, but original time in previous day', () => {
                let formattedDate = new DateFormatterPipe().transform('Wed, 15 Nov 2017 01:00:00 GMT', -2);

                it('should reduce by 2 hours and decrease the day', () => {
                    expect(formattedDate).toBe('Nov 14, 2017 at 11:00 PM')
                });
            });
        });
    });
});
