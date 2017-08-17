'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');
const ScheduleDataPreparationHelper = require('./helpers/schedule_data_preparation_helper');

const createFunction = require('../src/schedule/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setCreateFunction(createFunction, 'create');

const idLength = 36;

describe('create_schedule', () => {
    before((done) => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });


    it('Should create schedule with all fields, id and revision number', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        schedule.enabled = false;

        let expectations = (body) => {
            expect(body).to.have.property('id').with.lengthOf(idLength);
            expect(body).to.have.property('settingId').that.equal('id_mock');
            expect(body).to.have.property('eventCron').that.equal(ScheduleDataPreparationHelper.getDefaultCronExpression());
            expect(body).to.have.property('endEventCron').that.equal(ScheduleDataPreparationHelper.getDefaultCronExpression());
            expect(body).to.have.property('enabled').that.equal(false);
            expect(body).to.have.property('_rev').that.equal(0);
        };

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Should create schedule with automatically generated `enabled` field', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();

        let expectations = (body)=> {
            expect(body).to.have.property('enabled').that.equal(true);
        };

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule without setting id', () => {
        let schedule = ScheduleDataPreparationHelper.createScheduleWithoutSettingId();

        let expectations = generateErrorExpectations('Schedule couldn\'t be without setting', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule without eventCron', () => {
        let schedule = ScheduleDataPreparationHelper.createScheduleWithoutEventCron();

        let expectations = generateErrorExpectations('Schedule couldn\'t be without eventCron', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule without endEventCron', () => {
        let schedule = ScheduleDataPreparationHelper.createScheduleWithoutEndEventCron();

        let expectations = generateErrorExpectations('Schedule couldn\'t be without endEventCron', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule without periodicity', () => {
        let schedule = ScheduleDataPreparationHelper.createScheduleWithoutPeriodicity();

        let expectations = generateErrorExpectations('Invalid periodicity', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule with invalid cron expressions', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        schedule.eventCron = '*';
        schedule.endEventCron = '*';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule with cron expression that includes non 0 value for seconds', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        schedule.eventCron = '* 0 12 * * *';
        schedule.endEventCron = '* 0 12 * * *';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule with cron expression that should be repeated every minute', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        schedule.eventCron = '0 * 12 * * *';
        schedule.endEventCron = '0 * 12 * * *';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule with cron expression that should be repeated every N minutes', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        schedule.eventCron = '0 */2 12 * * *';
        schedule.endEventCron = '0 */2 12 * * *';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule with cron expression that should be repeated every hour', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        schedule.eventCron = '0 8 * * * *';
        schedule.endEventCron = '0 8 * * * *';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule with cron expression that should be repeated every N hours', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        schedule.eventCron = '0 8 */5 * * *';
        schedule.endEventCron = '0 8 */5 * * *';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

});

function generateErrorExpectations(message, statusCode) {
    return (body, response) => {
        expect(body).to.have.property('message').that.equal(message);
        expect(response).to.have.property('statusCode').that.equal(statusCode);
    };
}