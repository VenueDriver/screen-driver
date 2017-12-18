'use strict';

const mochaPlugin = require('serverless-mocha-plugin');
const expect = mochaPlugin.chai.expect;

const CronValidator = require('../src/schedule/helpers/cron-validator');

describe('cron_validator', () => {

    describe('validate()', () => {

        describe('when input is 0 30 1 1 JAN * 2017, ONE_TIME', () => {
            const cron = '0 30 1 1 JAN * 2017';

            it('should return true', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.true;
            });
        });

        describe('when input is 30 1 1 1 JAN * 2017, ONE_TIME', () => {
            const cron = '30 1 1 1 JAN * 2017';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.false;
            });
        });

        describe('when input is * 1 1 1 JAN * 2017, ONE_TIME', () => {
            const cron = '* 1 1 1 JAN * 2017';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.false;
            });
        });

        describe('when input is 15 15 15 JAN * 2017, ONE_TIME', () => {
            const cron = '15 15 15 JAN * 2017';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 120 2 1 JAN * 2017, ONE_TIME', () => {
            const cron = '0 120 2 1 JAN * 2017';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 * 2 1 JAN * 2017, ONE_TIME', () => {
            const cron = '0 * 2 1 JAN * 2017';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 30 25 1 JAN * 2017, ONE_TIME', () => {
            const cron = '0 30 25 1 JAN * 2017';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 30 * 1 JAN * 2017, ONE_TIME', () => {
            const cron = '0 30 * 1 JAN * 2017';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 30 2 32 JAN * 2017, ONE_TIME', () => {
            const cron = '0 30 2 32 JAN * 2017';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 30 2 * JAN * 2017, ONE_TIME', () => {
            const cron = '0 30 2 * JAN * 2017';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 30 2 2 JJJ * 2017, ONE_TIME', () => {
            const cron = '0 30 2 2 JJJ * 2017';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 30 2 2 * * 2017, ONE_TIME', () => {
            const cron = '0 30 2 2 * * 2017';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 30 2 2 FEB * *, ONE_TIME', () => {
            const cron = '0 30 2 2 FEB * *';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 30 2 2 FEB * AAA, ONE_TIME', () => {
            const cron = '0 30 2 2 FEB * AAA';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 30 2 2 FEB *, ONE_TIME', () => {
            const cron = '0 30 2 2 FEB *';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 30 2 2 FEB 2017, ONE_TIME', () => {
            const cron = '0 30 2 2 FEB 2017';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 15 1 * * SUN,WED,THU, ONE_TIME', () => {
            const cron = '0 15 1 * * SUN,WED,THU';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'ONE_TIME');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 0 14 * * SUN,WED,THU, REPEATABLE', () => {
            const cron = '0 0 14 * * SUN,WED,THU';

            it('should return true', () => {
                let result = CronValidator.validate(cron, 'REPEATABLE');
                expect(result).to.be.true;
            });
        });

        describe('when input is 0 14 * * SUN,WED,THU, REPEATABLE', () => {
            const cron = '0 14 * * SUN,WED,THU';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'REPEATABLE');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 0 14 * * SUN;WED;THU, REPEATABLE', () => {
            const cron = '0 0 14 * * SUN;WED;THU';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'REPEATABLE');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 0 14 * * *, REPEATABLE', () => {
            const cron = '0 0 14 * * *';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'REPEATABLE');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 0 14 1 * SUN,WED,THU, REPEATABLE', () => {
            const cron = '0 0 14 1 * SUN,WED,THU';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'REPEATABLE');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 0 14 * JAN SUN,WED,THU, REPEATABLE', () => {
            const cron = '0 0 14 * JAN SUN,WED,THU';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'REPEATABLE');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 0 14 * 5 SUN,WED,THU, REPEATABLE', () => {
            const cron = '0 0 14 * 5 SUN,WED,THU';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'REPEATABLE');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 0 14 * * SUN,SAN, REPEATABLE', () => {
            const cron = '0 0 14 * * SUN,SAN';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'REPEATABLE');
                expect(result).to.be.false;
            });
        });

        describe('when input is 0 30 1 1 JAN * 2017, REPEATABLE', () => {
            const cron = '0 30 1 1 JAN * 2017';

            it('should return false', () => {
                let result = CronValidator.validate(cron, 'REPEATABLE');
                expect(result).to.be.false;
            });
        });

    });

});
