'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const createFunction = require('../schedule/create.js');
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
        let content = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', cron: '* * * * *'};

        let expectations = (body) => {
            expect(body).to.have.property('id').with.lengthOf(idLength);
            expect(body).to.have.property('setting_id').that.equal('id_mock');
            expect(body).to.have.property('startDate').that.equal('2017-07-26T00:00:00.000Z');
            expect(body).to.have.property('cron').that.equal('* * * * *');
            expect(body).to.have.property('_rev').that.equal(0);
        };

        return MultiOperationHelper.performCreateTest(content, expectations);
    });

    it('Shouldn\'t create schedule without setting', () => {
        let content = {startDate: '2017-07-26T00:00:00.000Z', cron: '* * * * *'};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without setting');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performCreateTest(content, expectations);
    });

    it('Shouldn\'t create schedule without start date', () => {
        let content = {setting_id: 'id_mock', cron: '* * * * *'};

        let expectations = (body, response)=> {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without start date');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performCreateTest(content, expectations);
    });

    it('Shouldn\'t create schedule with uncorrect start date', () => {
        let content = {setting_id: 'id_mock', startDate: 'Monday 27 of July', cron: '* * * * *'};

        let expectations = (body, response)=> {
            expect(body).to.have.property('message').that.equal('Wrong data format');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performCreateTest(content, expectations);
    });

    it('Shouldn\'t create schedule without cron', () => {
        let content = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z'};

        let expectations = (body, response)=> {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without cron');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performCreateTest(content, expectations);
    });
});
