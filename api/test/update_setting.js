'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const createFunction = require('../setting/create');
const updateFunction = require('../setting/update');
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

    it('Should update the name and increase revision', () => {
        let newConfig = {name: 'New Year Party'};
        let updatedConfig = {name: 'New Year', _rev: 0};

        let expectations = (body) => {
            expect(body).to.have.property('id').with.lengthOf(idLength);
            expect(body).to.have.property('name').that.equal('New Year');
            expect(body).to.have.property('_rev').that.equal(1);
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });

    it('Should enable configuration', () => {
        let newConfig = {name: 'New Year Party', enabled: false};
        let updatedConfig = {name: 'New Year', enabled: true, _rev: 0};

        let expectations = (body) => {
            expect(body).to.have.property('enabled').that.equal(true);
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });

    it('Shouldn\'t update setting without name', () => {
        let newConfig = {name: 'New Year'};
        let updatedConfig = {_rev: 0};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Config couldn\'t be without name');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });

    it('Shouldn\'t update setting with empty name', () => {
        let newConfig = {name: 'New Year'};
        let updatedConfig = {name: '', _rev: 0};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Config couldn\'t be without name');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });

    it('Shouldn\'t update setting with name length 3 or less', () => {
        let newConfig = {name: 'New Year'};
        let updatedConfig = {name: 'NYP', _rev: 0};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Config\'s name should be longer then 3 symbols');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });

    it('Shouldn\'t update setting with non-boolean enable field', () => {
        let newConfig = {name: 'New Year'};
        let updatedConfig = {name: 'New Year', enabled: 'string', _rev: 0};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Enabled field should be boolean');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations);
    });

    it('Shouldn\'t update setting with existing name', () => {
        let existingConfig = {name: 'New Year'};
        let newConfig = {name: 'New Year Party'};
        let updatedConfig = {name: 'New Year', _rev: 0};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Config with such name already exists');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.create(existingConfig)
            .then(() => MultiOperationHelper.performUpdateTest(newConfig, updatedConfig, expectations));
    });

    //Todo: implement tests for updating the setting field;
});
