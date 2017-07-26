'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const getAllFunction = require('../schedule/list.js');
const createFunction = require('../schedule/create.js');
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
        let firstContent = {setting_id: 'id_mock_1', startDate: '2017-07-26T00:00:00.000Z', cron: '* */5 * * *'};
        let secondContent = {setting_id: 'id_mock_2', startDate: '2017-07-26T00:00:00.000Z', cron: '*/5 * * * *'};

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(200);
            expect(body).is.an('array').that.lengthOf(2);
        };

        return MultiOperationHelper.create(firstContent)
            .then(() => MultiOperationHelper.performListTest(secondContent, expectations));
    });
});
