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
        let content = {setting_id: 'id_mock', eventCron: '* * * * *', endEventCron: '* * * * *'};

        let expectations = (body) => {
            expect(body).to.have.property('id').with.lengthOf(idLength);
            expect(body).to.have.property('setting_id').that.equal('id_mock');
            expect(body).to.have.property('eventCron').that.equal('* * * * *');
            expect(body).to.have.property('endEventCron').that.equal('* * * * *');
            expect(body).to.have.property('_rev').that.equal(0);
        };

        return MultiOperationHelper.performCreateTest(content, expectations);
    });

    it('Shouldn\'t create schedule without setting', () => {
        let content = {eventCron: '* * * * *', endEventCron: '* * * * *'};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without setting');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performCreateTest(content, expectations);
    });

    it('Shouldn\'t create schedule without eventCron', () => {
        let content = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', endEventCron: '* * * * *'};

        let expectations = (body, response)=> {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without eventCron');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performCreateTest(content, expectations);
    });

    it('Shouldn\'t create schedule without endEventCron', () => {
        let content = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', eventCron: '* * * * *'};

        let expectations = (body, response)=> {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without endEventCron');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performCreateTest(content, expectations);
    });
});