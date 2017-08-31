'use strict';

require('./helpers/test_provider_configurator').configure();

const DatabaseCleaner = require('./helpers/database_cleaner');
const ScheduleDataPreparationHelper = require('./helpers/schedule_data_preparation_helper');
const TestDataSaver = require('./helpers/test_data_saver');

const getAllFunction = require('../src/schedule/list.js');
const createFunction = require('../src/schedule/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setGetAllFunction(getAllFunction, 'list')
    .setCreateFunction(createFunction, 'create');


describe('get_schedules_list', () => {
    before((done) => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });


    it('Should display empty list if no schedules created', () => {
        let expectations = (body) => {
            expect(body).is.an('array').that.is.empty;
        };

        return MultiOperationHelper.performListTest({}, expectations);
    });

    it('Should return a list of schedules that contains 2 items if 2 schedules has been created', () => {
        let firstSchedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        let secondSchedule = ScheduleDataPreparationHelper.createDefaultRepeatableSchedule();

        return TestDataSaver.saveSchedule(firstSchedule)
            .then(() => TestDataSaver.saveSchedule(secondSchedule))
            .then(() => MultiOperationHelper.getAll())
            .then(result => {
                let expectations = (body, response) => {
                    expect(response).to.have.property('statusCode').that.equal(200);
                    expect(body).is.an('array').that.lengthOf(2);
                };

                return MultiOperationHelper.test(result, expectations)
            })
    });
});
