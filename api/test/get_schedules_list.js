'use strict';

require('./helpers/test_provider_configurator').configure();

const DatabaseCleaner = require('./helpers/database_cleaner');
const ScheduleDataPreparationHelper = require('./helpers/schedule_data_preparation_helper');

const getAllFunction = require('../src/schedule/list.js');
const createFunction = require('../src/schedule/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setGetAllFunction(getAllFunction, 'list')
    .setCreateFunction(createFunction, 'create');


describe('schedule_list', () => {
    before((done) => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });


    it('Should display empty list', () => {
        let expectations = (body) => {
            expect(body).is.an('array').that.is.empty;
        };

        return MultiOperationHelper.performListTest({}, expectations);
    });

    it('Should display list with 2 schedules', () => {
        let firstContent = ScheduleDataPreparationHelper.createDefaultSchedule();
        let secondContent = ScheduleDataPreparationHelper.createDefaultSchedule();

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(200);
            expect(body).is.an('array').that.lengthOf(2);
        };

        return MultiOperationHelper.performListTest([firstContent, secondContent], expectations)
    });
});
