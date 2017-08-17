'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

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
        let newSchedule = {settingId: 'id_mock_1', eventCron: '* * * * *', endEventCron: '* * * * *', enabled: true, periodicity: 'ONE_TIME'};
        let updatedSchedule = {settingId: 'id_mock_2', eventCron: '* * * * *', _rev: 0, endEventCron: '* * * * *', enabled: false, periodicity: 'ONE_TIME'};

        let expectations = (body) => {
            expect(body).to.have.property('id').with.lengthOf(idLength);
            expect(body).to.have.property('settingId').that.equal('id_mock_2');
            expect(body).to.have.property('enabled').that.equal(false);
            expect(body).to.have.property('_rev').that.equal(1);
        };

        return MultiOperationHelper.performUpdateTest(newSchedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule without settingId', () => {
        let newSchedule = {settingId: 'id_mock', eventCron: '* * * * *', endEventCron: '* * * * *', periodicity: 'ONE_TIME'};
        let updatedSchedule = {startDate: '2017-07-26T00:00:00.000Z', eventCron: '* * * * *', _rev: 0, endEventCron: '* * * * *', periodicity: 'ONE_TIME'};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without setting');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newSchedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule with empty settingId', () => {
        let newSchedule = {settingId: 'id_mock', eventCron: '* * * * *', endEventCron: '* * * * *', periodicity: 'ONE_TIME'};
        let updatedSchedule = {settingId: '', eventCron: '* * * * *', _rev: 0, endEventCron: '* * * * *', periodicity: 'ONE_TIME'};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without setting');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newSchedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule without eventCron', () => {
        let newSchedule = {settingId: 'id_mock', eventCron: '* * * * *', endEventCron: '* * * * *', periodicity: 'ONE_TIME'};
        let updatedSchedule = {settingId: 'id_mock', _rev: 0, endEventCron: '* * * * *', periodicity: 'ONE_TIME'};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without eventCron');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newSchedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule with empty eventCron', () => {
        let newSchedule = {settingId: 'id_mock', eventCron: '* * * * *', endEventCron: '* * * * *', periodicity: 'ONE_TIME'};
        let updatedSchedule = {settingId: 'id_mock', eventCron: '', _rev: 0, endEventCron: '* * * * *', periodicity: 'ONE_TIME'};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without eventCron');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newSchedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule without endEventCron', () => {
        let newSchedule = {settingId: 'id_mock', eventCron: '* * * * *', endEventCron: '* * * * *', periodicity: 'ONE_TIME'};
        let updatedSchedule = {settingId: 'id_mock', _rev: 0, eventCron: '* * * * *', periodicity: 'ONE_TIME'};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without endEventCron');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newSchedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule with empty endEventCron', () => {
        let newSchedule = {settingId: 'id_mock', eventCron: '* * * * *', endEventCron: '* * * * *', periodicity: 'ONE_TIME'};
        let updatedSchedule = {settingId: 'id_mock', _rev: 0, eventCron: '* * * * *', endEventCron: '', periodicity: 'ONE_TIME'};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without endEventCron');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newSchedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule without periodicity', () => {
        let newSchedule = {settingId: 'id_mock', eventCron: '* * * * *', endEventCron: '* * * * *', periodicity: 'ONE_TIME'};
        let updatedSchedule = {settingId: 'id_mock', _rev: 0, eventCron: '* * * * *', endEventCron: '* * * * *'};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Invalid periodicity');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newSchedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule with wrong revision number', () => {
        let newSchedule = {settingId: 'id_mock', eventCron: '* * * * *', endEventCron: '* * * * *', periodicity: 'ONE_TIME'};
        let updatedSchedule = {settingId: 'id_mock', eventCron: '', _rev: 3, endEventCron: '* * * * *', periodicity: 'ONE_TIME'};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Schedule couldn\'t be without eventCron');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newSchedule, updatedSchedule, expectations);
    });

    it('Shouldn\'t update schedule without revision number', () => {
        let newSchedule = {settingId: 'id_mock', eventCron: '* * * * *', endEventCron: '* * * * *', periodicity: 'ONE_TIME'};
        let updatedSchedule = {settingId: 'id_mock', eventCron: '', endEventCron: '* * * * *', periodicity: 'ONE_TIME'};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Missed revision number');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newSchedule, updatedSchedule, expectations);
    });
});
