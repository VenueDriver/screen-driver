'use strict';

require('./helpers/test_provider_configurator').configure();

const DatabaseCleaner = require('./helpers/database_cleaner');
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
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    it('Should update the setting id and increase revision', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        let updatedSchedule = ScheduleDataPreparationHelper.createDefaultSchedule();
        updatedSchedule.settingId = 'id_mock_2';
        updatedSchedule.enabled = false;

        let expectations = (body) => {
            expect(body).to.have.property('id').with.lengthOf(idLength);
            expect(body).to.have.property('settingId').that.equal('id_mock_2');
            expect(body).to.have.property('enabled').that.equal(false);
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
});

function generateErrorExpectations(message, statusCode) {
    return (body, response) => {
        expect(body).to.have.property('message').that.equal(message);
        expect(response).to.have.property('statusCode').that.equal(statusCode);
    };
}
