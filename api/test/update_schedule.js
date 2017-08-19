'use strict';

require('./helpers/test_provider_configurator').configure();

const DatabaseCleaner = require('./helpers/database_cleaner');
const TestDataSever = require('./helpers/test_data_saver');
const ScheduleDataPreparationHelper = require('./helpers/schedule_data_preparation_helper');

const createFunction = require('../src/schedule/create');
const updateFunction = require('../src/schedule/update');
const mochaPlugin = require('serverless-mocha-plugin');

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setCreateFunction(createFunction, 'create')
    .setUpdateFunction(updateFunction, 'update');

const idLength = 36;

describe('update_setting', () => {

    before((done) => {
        DatabaseCleaner.cleanDatabase()
            .then(() => TestDataSever.saveDefaultSetting())
            .then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase()
            .then(() => TestDataSever.saveDefaultSetting())
            .then(() => done());
    });

    it('Should update the setting id and increase revision', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule.settingId = 'setting_id';
        updatedSchedule.enabled = false;

        let expectations = (body) => {
            expect(body).to.have.property('id').with.lengthOf(idLength);
            expect(body).to.have.property('settingId').that.equal('setting_id');
            expect(body).to.have.property('enabled').that.equal(false);
            expect(body).to.have.property('_rev').that.equal(1);
        };

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Should update schedule ignoring unknown fields', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule.enabled = true;
        updatedSchedule.date = new Date();

        let expectations = (body) => {
            expect(body).to.not.have.property('data');
            expect(body).to.have.property('_rev').that.equal(1);
        };

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule without settingId', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createScheduleWithoutSettingId();

        let expectations = generateErrorExpectations('Schedule couldn\'t be without setting', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule with empty settingId', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createScheduleWithEmptySettingId();

        let expectations = generateErrorExpectations('Schedule couldn\'t be without setting', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule without eventCron', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createScheduleWithoutEventCron();

        let expectations = generateErrorExpectations('Schedule couldn\'t be without eventCron', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule with empty eventCron', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createScheduleWithEmptyEventCron();

        let expectations = generateErrorExpectations('Schedule couldn\'t be without eventCron', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule without endEventCron', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createScheduleWithoutEndEventCron();

        let expectations = generateErrorExpectations('Schedule couldn\'t be without endEventCron', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule with empty endEventCron', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createScheduleWithEmptyEndEventCron();

        let expectations = generateErrorExpectations('Schedule couldn\'t be without endEventCron', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule without periodicity', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createScheduleWithoutPeriodicity();

        let expectations = generateErrorExpectations('Invalid periodicity', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule with invalid periodicity', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createScheduleWithoutPeriodicity();
        updatedSchedule.periodicity = 'SOME_PERIODICITY';

        let expectations = generateErrorExpectations('Invalid periodicity', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule with wrong revision number', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule._rev = 3;

        let expectations = generateErrorExpectations('The conditional request failed', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule without revision number', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createScheduleWithoutRevisionNumber();

        let expectations = generateErrorExpectations('Missed revision number', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule with invalid cron expressions', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule.eventCron = '*';
        updatedSchedule.endEventCron = '*';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule with cron expression that includes non 0 value for seconds', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule.eventCron = '1 0 8 1 JUN * 2017';
        updatedSchedule.endEventCron = '1 0 8 1 JUN * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule with cron expression that should be repeated every minute', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule.eventCron = '0 * 8 1 JUN * 2017';
        updatedSchedule.endEventCron = '0 * 8 1 JUN * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule with cron expression that should be repeated every N minutes', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule.eventCron = '0 */2 8 1 JUN * 2017';
        updatedSchedule.endEventCron = '0 */2 8 1 JUN * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule with cron expression that should be repeated every hour', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule.eventCron = '0 0 * 1 JAN * 2017';
        updatedSchedule.endEventCron = '0 0 * 1 JAN * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule with cron expression that should be repeated every N hours', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule.eventCron = '0 0 */8 1 JUN * 2017';
        updatedSchedule.endEventCron = '0 0 */8 1 JUN * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update one time schedule that should be repeated every day', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule.eventCron = '0 0 13 * JAN * 2017';
        updatedSchedule.endEventCron = '0 0 13 * JAN * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update one time schedule that should be repeated every N days', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule.eventCron = '0 0 13 */5 JAN * 2017';
        updatedSchedule.endEventCron = '0 0 13 */5 JAN * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update one time schedule that should be repeated every month', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule.eventCron = '0 0 13 1 * * 2017';
        updatedSchedule.endEventCron = '0 0 13 1 * * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update one time schedule that should be repeated every N months', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule.eventCron = '0 0 13 1 */5 * 2017';
        updatedSchedule.endEventCron = '0 0 13 1 */5 * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update one time schedule that should be repeated every year', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule.eventCron = '0 0 8 1 JAN * *';
        updatedSchedule.endEventCron = '0 0 8 1 JAN * *';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update one time schedule that should be repeated every N years', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule.eventCron = '0 0 8 1 JAN * */5';
        updatedSchedule.endEventCron = '0 0 8 1 JAN * */5';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update one time schedule with cron expression that includes invalid amount of parts', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule.eventCron = '0 0 8 1 JAN MON';
        updatedSchedule.endEventCron = '0 0 8 1 JAN MON';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update repeatable schedule with cron expression that includes invalid amount of parts', () => {
        let schedule = ScheduleDataPreparationHelper.createRepeatableSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createRepeatableSchedule();
        updatedSchedule.eventCron = '0 0 8 1 JAN * 2017';
        updatedSchedule.endEventCron = '0 0 8 1 JAN * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update repeatable schedule with cron expression that includes date', () => {
        let schedule = ScheduleDataPreparationHelper.createRepeatableSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createRepeatableSchedule();
        updatedSchedule.eventCron = '0 0 8 1 * MON';
        updatedSchedule.endEventCron = '0 0 8 1 * MON';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update repeatable schedule with cron expression that includes month', () => {
        let schedule = ScheduleDataPreparationHelper.createRepeatableSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createRepeatableSchedule();
        updatedSchedule.eventCron = '0 0 8 * JAN MON';
        updatedSchedule.endEventCron = '0 0 8 * JAN MON';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule bound with unknown setting', () => {
        let schedule = ScheduleDataPreparationHelper.createRepeatableSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createRepeatableSchedule();
        updatedSchedule.settingId = 'invalid_setting_id';

        let expectations = generateErrorExpectations('Invalid setting', 500);

        return MultiOperationHelper.performUpdateTest(schedule, updatedSchedule, expectations);
    });
});

function generateErrorExpectations(message, statusCode) {
    return (body, response) => {
        expect(body).to.have.property('message').that.equal(message);
        expect(response).to.have.property('statusCode').that.equal(statusCode);
    };
}
