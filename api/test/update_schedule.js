'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const createFunction = require('../schedule/create');
const updateFunction = require('../schedule/update');
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
        let newConfig = {setting_id: 'id_mock_1', startDate: '2017-07-26T00:00:00.000Z', cron: '* * * * *'};
        let updatedConfig = {setting_id: 'id_mock_2', startDate: '2017-07-26T00:00:00.000Z', cron: '* * * * *', _rev: 0};

        let expectations = (body) => {
            expect(body).to.have.property('id').with.lengthOf(idLength);
            expect(body).to.have.property('setting_id').that.equal('id_mock_2');
            expect(body).to.have.property('_rev').that.equal(1);
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });

    it('Should update the start date', () => {
        let newConfig = {setting_id: 'id_mock', startDate: '2018-07-26T00:00:00.000Z', cron: '* * * * *'};
        let updatedConfig = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', cron: '* * * * *', _rev: 0};

        let expectations = (body) => {
            expect(body).to.have.property('startDate').that.equal('2017-07-26T00:00:00.000Z');
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });

    it('Should update the start date', () => {
        let newConfig = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', cron: '*/5 * * * *'};
        let updatedConfig = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', cron: '* * * * */5', _rev: 0};

        let expectations = (body) => {
            expect(body).to.have.property('cron').that.equal('* * * * */5');
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });

    it('Shouldn\'t update schedule without setting_id', () => {
        let newConfig = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', cron: '* * * * *'};
        let updatedConfig = {startDate: '2017-07-26T00:00:00.000Z', cron: '* * * * *', _rev: 0};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without setting');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });

    it('Shouldn\'t update schedule with empty setting_id', () => {
        let newConfig = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', cron: '* * * * *'};
        let updatedConfig = {setting_id: '', startDate: '2017-07-26T00:00:00.000Z', cron: '* * * * *', _rev: 0};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without setting');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });

    it('Shouldn\'t update schedule without start date', () => {
        let newConfig = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', cron: '* * * * *'};
        let updatedConfig = {setting_id: 'id_mock', cron: '* * * * *', _rev: 0};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without start date');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });

    it('Shouldn\'t update schedule with invalid start date', () => {
        let newConfig = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', cron: '* * * * *'};
        let updatedConfig = {setting_id: 'id_mock', startDate: 'Monday 27 of July', cron: '* * * * *', _rev: 0};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Wrong data format');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });

    it('Shouldn\'t update schedule without cron', () => {
        let newConfig = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', cron: '* * * * *'};
        let updatedConfig = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', _rev: 0};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without cron');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });

    it('Shouldn\'t update schedule with empty cron', () => {
        let newConfig = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', cron: '* * * * *'};
        let updatedConfig = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', cron: '', _rev: 0};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without cron');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });

    it('Shouldn\'t update schedule with wrong revision number', () => {
        let newConfig = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', cron: '* * * * *'};
        let updatedConfig = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', cron: '', _rev: 3};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without cron');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });

    it('Shouldn\'t update schedule without revision number', () => {
        let newConfig = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', cron: '* * * * *'};
        let updatedConfig = {setting_id: 'id_mock', startDate: '2017-07-26T00:00:00.000Z', cron: ''};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Missed revision number');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });
});
